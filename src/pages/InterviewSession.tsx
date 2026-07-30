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

    // True when this tab's persisted store belongs to this interview (regardless of
    // hydration timing). Used to allow resumption after a page close/reopen.
    const sessionBelongsHere = storedInterviewId === id
    const sessionMatchesThisInterview = sessionBelongsHere && phase !== 'idle'

    const [voiceEnabled, setVoiceEnabled] = useState(true)
    const [subtitle, setSubtitle] = useState<{ kind: SubtitleKind; text: string }>({
        kind: null,
        text: '',
    })

    const narration = useNarration(voiceEnabled)

    const hasStartedRef = useRef(false)
    const startFailedRef = useRef(false)  // sync guard — blocks retry without waiting for state
    const hasRequestedReportRef = useRef(false)
    const hasNarratedWelcomeRef = useRef(false)
    const narratedQuestionIdsRef = useRef<Set<string>>(new Set())
    // Drives the error UI — set after startFailedRef so state update is for display only.
    const [startError, setStartError] = useState<string | null>(null)

    // Synchronously computed during render (same condition as the kick-off effect)
    // so the preparing screen shows immediately without waiting for the effect to run.
    // Both refs are checked so we never loop on failure.
    const willAttemptStart =
        !!interview &&
        !!id &&
        (interview.status === 'pending' || interview.status === 'in_progress') &&
        !hasStartedRef.current &&
        !startFailedRef.current &&
        !sessionMatchesThisInterview

    // Reconcile persisted session against current URL on mount.
    // If the store belongs to a *different* interview, wipe it. If it matches
    // this interview, preserve everything so the user can resume seamlessly.
    useEffect(() => {
        const state = useInterviewStore.getState()
        if (state.interviewId && state.interviewId !== id) {
            // Different interview in store — clear it out
            state.reset()
            hasStartedRef.current = false
            startFailedRef.current = false
            hasRequestedReportRef.current = false
            hasNarratedWelcomeRef.current = false
            narratedQuestionIdsRef.current = new Set()
        } else if (state.interviewId === id && state.phase !== 'idle') {
            // Resuming this exact interview — keep refs in sync so narration
            // doesn't replay the welcome message for already-seen questions
            hasStartedRef.current = true
            startFailedRef.current = false
            hasRequestedReportRef.current = false
            hasNarratedWelcomeRef.current = true
            narratedQuestionIdsRef.current = new Set()
        } else {
            // Fresh start
            hasStartedRef.current = false
            startFailedRef.current = false
            hasRequestedReportRef.current = false
            hasNarratedWelcomeRef.current = false
            narratedQuestionIdsRef.current = new Set()
        }
    }, [id])

    // Kick off interview: fires for 'pending' (first start) and for 'in_progress'
    // when the user has no local session state (e.g. after a server restart,
    // re-login, or a hard refresh that cleared localStorage).
    // Uses startMutation.mutate (stable reference) instead of startMutation to
    // avoid re-firing on every mutation state change (pending→error→idle).
    const { mutate: startMutate } = startMutation
    useEffect(() => {
        if (!interview || !id) return

        if (interview.status === 'completed') {
            navigate(`/interviews/${id}/report`, { replace: true })
            return
        }

        const needsStart =
            (interview.status === 'pending' || interview.status === 'in_progress') &&
            !hasStartedRef.current &&
            !startFailedRef.current &&
            !sessionMatchesThisInterview

        if (needsStart) {
            hasStartedRef.current = true
            startMutate(id, {
                onError: (err) => {
                    // Set the ref first (synchronous) to block any re-entry before
                    // the state update triggers a re-render.
                    startFailedRef.current = true
                    toast.error(getErrorMessage(err))
                    setStartError(getErrorMessage(err))
                },
            })
        }
    }, [interview, id, navigate, startMutate, sessionMatchesThisInterview])

    // Narrate welcome message and questions
    useEffect(() => {
        if (!sessionMatchesThisInterview || phase !== 'active' || !currentQuestion) return
        if (narratedQuestionIdsRef.current.has(currentQuestion.id)) return
        narratedQuestionIdsRef.current.add(currentQuestion.id)

        if (welcomeMessage && !hasNarratedWelcomeRef.current && currentQuestion.questionNumber === 1) {
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

    const handleReplayQuestion = useCallback(() => {
        if (currentQuestion?.question) {
            setSubtitle({ kind: 'question', text: currentQuestion.question })
            narration.narrate(currentQuestion.question, () => {})
        }
    }, [currentQuestion, narration])

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

    // If the start/re-start call failed (e.g. backend rejects re-starting an
    // in_progress interview), show a clear error with a retry option.
    if (startError) {
        return (
            <SessionLoadingState
                kind="error"
                errorMessage={`Could not start interview: ${startError}. Please try again.`}
            />
        )
    }

    // Show preparing screen while starting (covers both fresh start and re-start
    // after localStorage was cleared due to re-login / server restart).
    // willAttemptStart is computed synchronously so this fires on the first render
    // tick — before startMutation.isPending has a chance to update.
    if (startMutation.isPending || willAttemptStart) {
        return <SessionLoadingState kind="preparing" isServerWakingUp={isServerWakingUp} />
    }

    // Only show stale_session when a *different* interview is actively loaded in
    // the store (true concurrent-tab conflict).
    if (
        interview.status === 'in_progress' &&
        !sessionMatchesThisInterview &&
        storedInterviewId !== null &&
        storedInterviewId !== id
    ) {
        return <SessionLoadingState kind="stale_session" />
    }

    // Zustand's persist middleware hydrates asynchronously. If the interview is
    // in_progress and the store ID matches but phase is still 'idle', we're just
    // waiting for localStorage to finish loading — show a resuming screen.
    if (interview.status === 'in_progress' && sessionBelongsHere && phase === 'idle') {
        return <SessionLoadingState kind="resuming" />
    }

    if (interview.status === 'pending' && !sessionMatchesThisInterview) {
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
                    onReplay={handleReplayQuestion}
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