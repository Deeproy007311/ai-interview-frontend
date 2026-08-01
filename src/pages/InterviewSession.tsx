import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import SessionHeader from '@/components/interview/SessionHeader'
import InterviewerAvatar from '@/components/interview/InterviewerAvatar'
import AnswerPanel from '@/components/interview/AnswerPanel'
import SessionLoadingState from '@/components/interview/SessionLoadingState'
import LeaveInterviewModal from '@/components/interview/LeaveInterviewModal'

import { answerSchema, type AnswerFormValues } from '@/schemas/interview.schema'
import { useInterview, useStartInterview, useSubmitAnswer, useGenerateReport, useDeleteInterview } from '@/hooks/useInterview'
import { useMe } from '@/hooks/useAuth'
import { useInterviewStore } from '@/store/interviewStore'
import { useUIStore } from '@/store/uiStore'
import { useNarration } from '@/hooks/useNarration'
import { useAudioRecorder } from '@/hooks/useAudioRecorder'
import { getErrorMessage } from '@/api/client'

type SubtitleKind = 'welcome' | 'transition' | 'question' | null

export default function InterviewSession() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const isServerWakingUp = useUIStore((s) => s.isServerWakingUp)
    const { data: user } = useMe()

    const { data: interview, isLoading: interviewLoading, error: interviewError } = useInterview(id)
    const startMutation = useStartInterview()
    const answerMutation = useSubmitAnswer()
    const reportMutation = useGenerateReport()
    const deleteMutation = useDeleteInterview()

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
    const [showLeaveModal, setShowLeaveModal] = useState(false)
    // Seed elapsed time from startedAt so the timer is always accurate even
    // after the user navigates away and returns to an in-progress interview.
    const [elapsedSeconds, setElapsedSeconds] = useState(0)
    const [subtitle, setSubtitle] = useState<{ kind: SubtitleKind; text: string }>({
        kind: null,
        text: '',
    })

    // Seed elapsed from real startedAt whenever the interview data loads or
    // changes (covers both first load and resumption after navigation).
    useEffect(() => {
        if (!interview?.startedAt) return
        const seeded = Math.max(0, Math.floor((Date.now() - new Date(interview.startedAt).getTime()) / 1000))
        setElapsedSeconds(seeded)
    }, [interview?.startedAt])

    useEffect(() => {
        const interval = setInterval(() => {
            setElapsedSeconds((s) => s + 1)
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    const narration = useNarration(voiceEnabled)

    const hasStartedRef = useRef(false)
    const startFailedRef = useRef(false)  // sync guard — blocks retry without waiting for state
    const hasRequestedReportRef = useRef(false)
    const hasNarratedWelcomeRef = useRef(false)
    const narratedQuestionIdsRef = useRef<Set<string>>(new Set())
    const narratedTransitionRef = useRef<string | null>(null)
    // Drives the error UI — set after startFailedRef so state update is for display only.
    const [startError, setStartError] = useState<string | null>(null)

    const userInitials = user?.name
        ? user.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)
        : 'DR'
    const userName = user?.name || 'You'

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
            narratedTransitionRef.current = null
        } else if (state.interviewId === id && state.phase !== 'idle') {
            // Resuming this exact interview — keep refs in sync so narration
            // doesn't replay the welcome message for already-seen questions
            hasStartedRef.current = true
            startFailedRef.current = false
            hasRequestedReportRef.current = false
            hasNarratedWelcomeRef.current = true
            narratedQuestionIdsRef.current = new Set()
            narratedTransitionRef.current = null
        } else {
            // Fresh start
            hasStartedRef.current = false
            startFailedRef.current = false
            hasRequestedReportRef.current = false
            hasNarratedWelcomeRef.current = false
            narratedQuestionIdsRef.current = new Set()
            narratedTransitionRef.current = null
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

    // Reset transition ref when leaving transitioning phase
    useEffect(() => {
        if (phase !== 'transitioning') {
            narratedTransitionRef.current = null
        }
    }, [phase])

    // Narrate transition line & auto advance
    useEffect(() => {
        if (!sessionMatchesThisInterview || phase !== 'transitioning') return

        if (!transitionMessage) {
            revealNextQuestion()
            return
        }

        if (narratedTransitionRef.current === transitionMessage) return
        narratedTransitionRef.current = transitionMessage

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

    const audioRecorder = useAudioRecorder({
        onTranscribed: useCallback(
            (text: string) => {
                const current = getValues('transcript') || ''
                const newText = text.trim()
                if (!newText) return
                const updated = current.trim() ? `${current.trim()} ${newText}` : newText
                setValue('transcript', updated, { shouldValidate: true })
            },
            [getValues, setValue],
        ),
        onError: useCallback((message: string) => toast.error(message), []),
    })

    // Stop mic when leaving active phase
    useEffect(() => {
        if (phase !== 'active' && audioRecorder.isRecording) {
            audioRecorder.stop()
        }
    }, [phase, audioRecorder])

    const isTimeUp =
        !!interview?.duration &&
        interview.duration > 0 &&
        elapsedSeconds >= interview.duration * 60

    const onSubmitAnswer = (values: AnswerFormValues) => {
        if (!id || !currentQuestion) return
        if (audioRecorder.isRecording) {
            audioRecorder.stop()
        }
        answerMutation.mutate(
            {
                id,
                payload: {
                    questionId: currentQuestion.id,
                    transcript: values.transcript,
                    // Tell the backend time is up — it will skip follow-ups and
                    // force-complete the interview after evaluating this answer.
                    isTimedOut: isTimeUp,
                },
            },
            {
                onSuccess: () => resetForm(),
                onError: (err) => toast.error(getErrorMessage(err)),
            },
        )
    }

    const toggleMic = () => {
        if (audioRecorder.isRecording) {
            audioRecorder.stop()
        } else {
            audioRecorder.start()
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
        <div className="min-h-screen bg-[#f4f5f7] sm:py-5 sm:px-6 flex items-center justify-center font-sans text-slate-900 selection:bg-indigo-500 selection:text-white">
            {/* Main Outer Container Frame */}
            <div className="w-full max-w-7xl h-screen sm:h-[94vh] bg-white sm:rounded-3xl border border-slate-200/80 shadow-xl flex flex-col overflow-hidden relative">
                {/* Header */}
                <SessionHeader
                    currentQuestionNumber={currentQuestion?.questionNumber}
                    totalQuestions={totalQuestions}
                    section={currentQuestion?.section}
                    elapsedSeconds={elapsedSeconds}
                    targetDurationMinutes={interview.duration}
                    onExitRequest={() => setShowLeaveModal(true)}
                />

                {/* Split View Body */}
                <div className="flex-1 flex flex-col lg:flex-row p-4 sm:p-6 gap-5 overflow-y-auto lg:overflow-hidden min-h-0 bg-white">
                    {/* Left: Interactive AI Interviewer Graphic & Teleprompter */}
                    <InterviewerAvatar
                        isNarrating={narration.isNarrating}
                        subtitle={subtitle}
                        isTransitioning={isTransitioning}
                        onSkip={() => narration.skip()}
                        onReplay={handleReplayQuestion}
                    />

                    {/* Right: Candidate Profile & Answer Panel */}
                    <AnswerPanel
                        isAnswering={isAnswering}
                        isSubmitting={answerMutation.isPending}
                        transcriptValue={transcriptValue}
                        isListening={audioRecorder.isRecording}
                        isTranscribing={audioRecorder.isTranscribing}
                        isSpeechSupported={audioRecorder.isSupported}
                        isServerWakingUp={isServerWakingUp}
                        userName={userName}
                        userInitials={userInitials}
                        register={register}
                        errors={errors}
                        onToggleMic={toggleMic}
                        onSubmit={handleSubmit(onSubmitAnswer)}
                    />
                </div>

                {/* Bottom Actions Floating Controls Bar */}
                <div className="py-3 px-6 bg-white border-t border-slate-100 flex items-center justify-center gap-3 shrink-0 select-none">
                    {/* Audio Mute/Unmute Toggle */}
                    <button
                        type="button"
                        onClick={() => setVoiceEnabled((v) => !v)}
                        disabled={!narration.isVoiceSupported}
                        title={voiceEnabled ? 'Mute AI Voice' : 'Unmute AI Voice'}
                        className={`w-10 h-10 rounded-full border flex items-center justify-center text-sm transition-all shadow-xs active:scale-95 ${
                            voiceEnabled
                                ? 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                                : 'bg-slate-100 text-slate-400 border-slate-200'
                        }`}
                    >
                        {voiceEnabled ? '🔊' : '🔇'}
                    </button>

                    {/* Subtitle / Repeat Question */}
                    <button
                        type="button"
                        onClick={handleReplayQuestion}
                        title="Repeat Question Audio"
                        className="w-10 h-10 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center justify-center text-sm transition-all shadow-xs active:scale-95"
                    >
                        💬
                    </button>

                    {/* Leave Interview Button */}
                    <button
                        type="button"
                        onClick={() => setShowLeaveModal(true)}
                        className="inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-semibold text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 bg-white hover:bg-red-50 rounded-full shadow-xs transition-all active:scale-95 ml-2"
                    >
                        Leave interview
                    </button>
                </div>
            </div>

            {/* Leave / Delete confirmation modal */}
            <LeaveInterviewModal
                isOpen={showLeaveModal}
                isDeleting={deleteMutation.isPending}
                onCancel={() => setShowLeaveModal(false)}
                onConfirm={() => {
                    if (!id) return
                    deleteMutation.mutate(id, {
                        onSuccess: () => {
                            toast.success('Interview deleted.')
                            navigate('/dashboard', { replace: true })
                        },
                        onError: (err) => {
                            toast.error(getErrorMessage(err))
                            setShowLeaveModal(false)
                        },
                    })
                }}
            />
        </div>
    )
}