import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import SessionHeader from '@/components/interview/SessionHeader'
import InterviewerAvatar from '@/components/interview/InterviewerAvatar'
import AnswerPanel from '@/components/interview/AnswerPanel'
import SessionLoadingState from '@/components/interview/SessionLoadingState'

import { answerSchema, type AnswerFormValues } from '@/schemas/interview.schema'
import { useInterview, useStartInterview, useSubmitAnswer, useGenerateReport } from '@/hooks/useInterview'
import { useInterviewStore } from '@/store/interviewStore'
import { useUIStore } from '@/store/uiStore'
import { useNarration } from '@/hooks/useNarration'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import { getErrorMessage } from '@/api/client'

type SubtitleKind = 'welcome' | 'transition' | 'question' | null

export default function InterviewSession() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const isServerWakingUp = useUIStore((s) => s.isServerWakingUp)

    const { data: interview, isLoading: interviewLoading, error: interviewError } = useInterview(id)
    const startMutation = useStartInterview()
    const answerMutation = useSubmitAnswer()
    const reportMutation = useGenerateReport()

    const storedInterviewId = useInterviewStore((s) => s.interviewId)
    const phase = useInterviewStore((s) => s.phase)
    const welcomeMessage = useInterviewStore((s) => s.welcomeMessage)
    const currentQuestion = useInterviewStore((s) => s.currentQuestion)
    const transitionMessage = useInterviewStore((s) => s.transitionMessage)
    const totalQuestions = useInterviewStore((s) => s.totalQuestions)
    const revealNextQuestion = useInterviewStore((s) => s.revealNextQuestion)
    const resetSession = useInterviewStore((s) => s.reset)

    const sessionMatchesThisInterview = storedInterviewId === id && phase !== 'idle'

    const [voiceEnabled, setVoiceEnabled] = useState(true)
    const [subtitle, setSubtitle] = useState<{ kind: SubtitleKind; text: string }>({
        kind: null,
        text: '',
    })

    const narration = useNarration(voiceEnabled)

    const hasStartedRef = useRef(false)
    const hasRequestedReportRef = useRef(false)
    const hasNarratedWelcomeRef = useRef(false)
    const narratedQuestionIdsRef = useRef<Set<string>>(new Set())

    // Reconcile persisted session against current URL on mount
    useEffect(() => {
        const state = useInterviewStore.getState()
        if (state.interviewId && state.interviewId !== id) {
            state.reset()
            hasStartedRef.current = false
        } else {
            hasStartedRef.current = state.interviewId === id && state.phase !== 'idle'
        }
        hasRequestedReportRef.current = false
        hasNarratedWelcomeRef.current = false
        narratedQuestionIdsRef.current = new Set()
    }, [id])

    // Kick off interview if pending
    useEffect(() => {
        if (!interview || !id) return

        if (interview.status === 'completed') {
            navigate(`/interviews/${id}/report`, { replace: true })
            return
        }

        if (interview.status === 'pending' && !hasStartedRef.current) {
            hasStartedRef.current = true
            startMutation.mutate(id, {
                onError: (err) => {
                    toast.error(getErrorMessage(err))
                    hasStartedRef.current = false
                },
            })
        }
    }, [interview, id, navigate, startMutation])

    // Narrate welcome message and questions
    useEffect(() => {
        if (!sessionMatchesThisInterview || phase !== 'active' || !currentQuestion) return
        if (narratedQuestionIdsRef.current.has(currentQuestion.id)) return
        narratedQuestionIdsRef.current.add(currentQuestion.id)

        if (welcomeMessage && !hasNarratedWelcomeRef.current) {
            hasNarratedWelcomeRef.current = true
            setSubtitle({ kind: 'welcome', text: welcomeMessage })
            narration.narrate(welcomeMessage, () => {
                setSubtitle({ kind: 'question', text: currentQuestion.question })
                narration.narrate(currentQuestion.question, () => {})
            })
        } else {
            setSubtitle({ kind: 'question', text: currentQuestion.question })
            narration.narrate(currentQuestion.question, () => {})
        }
    }, [sessionMatchesThisInterview, phase, currentQuestion, welcomeMessage, narration])

    // Narrate transition line & auto advance
    useEffect(() => {
        if (!sessionMatchesThisInterview || phase !== 'transitioning') return

        if (!transitionMessage) {
            revealNextQuestion()
            return
        }

        setSubtitle({ kind: 'transition', text: transitionMessage })
        narration.narrate(transitionMessage, () => {
            revealNextQuestion()
        })
    }, [sessionMatchesThisInterview, phase, transitionMessage, revealNextQuestion, narration])

    // Handle completed session -> report redirect
    useEffect(() => {
        if (phase !== 'complete' || !id || storedInterviewId !== id || hasRequestedReportRef.current) {
            return
        }
        hasRequestedReportRef.current = true
        reportMutation.mutate(id, {
            onSuccess: () => {
                resetSession()
                navigate(`/interviews/${id}/report`, { replace: true })
            },
            onError: (err) => {
                toast.error(getErrorMessage(err))
                hasRequestedReportRef.current = false
            },
        })
    }, [phase, id, storedInterviewId, reportMutation, resetSession, navigate])

    // Form setup for candidate transcript
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        getValues,
        reset: resetForm,
        formState: { errors },
    } = useForm<AnswerFormValues>({
        resolver: zodResolver(answerSchema),
        defaultValues: { transcript: '' },
    })

    const transcriptValue = watch('transcript')

    const speechRecognition = useSpeechRecognition({
        onResult: useCallback(
            (text: string) => {
                setValue('transcript', text, { shouldValidate: true })
            },
            [setValue],
        ),
        onError: useCallback((message: string) => toast.error(message), []),
    })

    // Stop mic when leaving active phase
    useEffect(() => {
        if (phase !== 'active') {
            speechRecognition.stop()
        }
    }, [phase, speechRecognition])

    const onSubmitAnswer = (values: AnswerFormValues) => {
        if (!id || !currentQuestion) return
        speechRecognition.stop()
        answerMutation.mutate(
            { id, payload: { questionId: currentQuestion.id, transcript: values.transcript } },
            {
                onSuccess: () => resetForm(),
                onError: (err) => toast.error(getErrorMessage(err)),
            },
        )
    }

    const toggleMic = () => {
        if (speechRecognition.isListening) {
            speechRecognition.stop()
        } else {
            speechRecognition.start(getValues('transcript') || '')
        }
    }

    // Fullscreen Guard States
    if (interviewLoading) {
        return <SessionLoadingState kind="loading" />
    }

    if (interviewError || !interview) {
        return <SessionLoadingState kind="error" errorMessage={getErrorMessage(interviewError)} />
    }

    if (interview.status === 'cancelled') {
        return <SessionLoadingState kind="cancelled" />
    }

    if (interview.status === 'in_progress' && !sessionMatchesThisInterview) {
        return <SessionLoadingState kind="stale_session" />
    }

    if (startMutation.isPending || (interview.status === 'pending' && !sessionMatchesThisInterview)) {
        return <SessionLoadingState kind="preparing" isServerWakingUp={isServerWakingUp} />
    }

    if (phase === 'complete' || reportMutation.isPending) {
        return <SessionLoadingState kind="generating_report" />
    }

    // Live Split-Screen View
    const isTransitioning = phase === 'transitioning'
    const isAnswering = phase === 'active' && !!currentQuestion

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
            {/* Header */}
            <SessionHeader
                currentQuestionNumber={currentQuestion?.questionNumber}
                totalQuestions={totalQuestions}
                section={currentQuestion?.section}
                voiceEnabled={voiceEnabled}
                isVoiceSupported={narration.isVoiceSupported}
                onToggleVoice={() => setVoiceEnabled((v) => !v)}
            />

            {/* Split View Body */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left: Interactive Human AI Interviewer Avatar & Closed Captions */}
                <InterviewerAvatar
                    isNarrating={narration.isNarrating}
                    subtitle={subtitle}
                    isTransitioning={isTransitioning}
                    onSkip={() => narration.skip()}
                />

                {/* Right: Candidate Answer & Voice Mic Input Panel */}
                <AnswerPanel
                    isAnswering={isAnswering}
                    isSubmitting={answerMutation.isPending}
                    transcriptValue={transcriptValue}
                    isListening={speechRecognition.isListening}
                    isSpeechSupported={speechRecognition.isSupported}
                    isServerWakingUp={isServerWakingUp}
                    register={register}
                    errors={errors}
                    onToggleMic={toggleMic}
                    onSubmit={handleSubmit(onSubmitAnswer)}
                />
            </div>
        </div>
    )
}