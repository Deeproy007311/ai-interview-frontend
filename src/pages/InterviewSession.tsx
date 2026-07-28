import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
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

    const sessionMatchesThisInterview = storedInterviewId === id && phase !== 'idle'

    // Reconcile persisted session against the current URL on mount / id change.
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

    // Kicks off the interview the first time we see it's pending.
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [interview, id])

    // Narrates the welcome message (once) followed by each new question as it
    // arrives. Real speech duration — or the neutral reading-time fallback —
    // paces this naturally instead of a fixed timer.
    useEffect(() => {
        if (phase !== 'active' || !currentQuestion) return
        if (narratedQuestionIdsRef.current.has(currentQuestion.id)) return
        narratedQuestionIdsRef.current.add(currentQuestion.id)

        if (welcomeMessage && !hasNarratedWelcomeRef.current) {
            hasNarratedWelcomeRef.current = true
            setSubtitle({ kind: 'welcome', text: welcomeMessage })
            narration.narrate(welcomeMessage, () => {
                setSubtitle({ kind: 'question', text: currentQuestion.question })
                narration.narrate(currentQuestion.question, () => { })
            })
        } else {
            setSubtitle({ kind: 'question', text: currentQuestion.question })
            narration.narrate(currentQuestion.question, () => { })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase, currentQuestion?.id, welcomeMessage])

    // Narrates the transition line, then auto-advances once it's actually
    // finished being said or read — not after an arbitrary short delay.
    useEffect(() => {
        if (phase !== 'transitioning') return

        if (!transitionMessage) {
            revealNextQuestion()
            return
        }

        setSubtitle({ kind: 'transition', text: transitionMessage })
        narration.narrate(transitionMessage, () => {
            revealNextQuestion()
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase, transitionMessage])

    // Once complete, generate (or re-fetch) the report and move on.
    useEffect(() => {
        if (phase !== 'complete' || !id || hasRequestedReportRef.current) return
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase, id])

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
            (chunk: string) => {
                const current = getValues('transcript') || ''
                const next = current ? `${current} ${chunk}` : chunk
                setValue('transcript', next, { shouldValidate: true })
            },
            [getValues, setValue],
        ),
        onError: useCallback((message: string) => toast.error(message), []),
    })

    // Stop listening whenever we leave the "waiting for an answer" phase.
    useEffect(() => {
        if (phase !== 'active') {
            speechRecognition.stop()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase])

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
            speechRecognition.start()
        }
    }

    // ---- Full-page states before the live Q&A split view ----

    if (interviewLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
                <p className="text-slate-400">Loading interview...</p>
            </div>
        )
    }

    if (interviewError || !interview) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-900 text-white">
                <p className="text-red-400">Could not load this interview.</p>
                <Link to="/dashboard" className="text-sm text-slate-400 underline">
                    Back to Dashboard
                </Link>
            </div>
        )
    }

    if (interview.status === 'cancelled') {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-900 text-white">
                <p className="text-slate-300">This interview was cancelled.</p>
                <Link to="/dashboard" className="text-sm text-slate-400 underline">
                    Back to Dashboard
                </Link>
            </div>
        )
    }

    if (interview.status === 'in_progress' && !sessionMatchesThisInterview) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-900 p-6 text-center text-white">
                <p className="max-w-md text-slate-300">
                    This interview is in progress, but its current question can't be recovered in this
                    browser tab. Continue in the tab where you started it, or return to the dashboard.
                </p>
                <Link to="/dashboard" className="text-sm text-slate-400 underline">
                    Back to Dashboard
                </Link>
            </div>
        )
    }

    if (startMutation.isPending || (interview.status === 'pending' && !sessionMatchesThisInterview)) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-900 text-white">
                <p className="text-slate-400">Preparing your interview...</p>
                {isServerWakingUp && (
                    <p className="text-sm text-yellow-400">
                        Waking up the server, this can take up to a minute...
                    </p>
                )}
            </div>
        )
    }

    if (phase === 'complete' || reportMutation.isPending) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
                <p className="text-slate-400">Generating your report...</p>
            </div>
        )
    }

    // ---- Live split-screen interview view ----

    const isTransitioning = phase === 'transitioning'
    const isAnswering = phase === 'active' && !!currentQuestion

    return (
        <div className="flex h-screen overflow-hidden bg-slate-900 text-white">
            {/* Left: AI panel */}
            <div className="flex flex-1 flex-col">
                <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
                    <p className="text-sm text-slate-400">
                        {currentQuestion
                            ? `Question ${currentQuestion.questionNumber} of ${totalQuestions} — ${currentQuestion.section}`
                            : 'Interview in progress'}
                    </p>
                    <button
                        type="button"
                        onClick={() => setVoiceEnabled((v) => !v)}
                        disabled={!narration.isVoiceSupported}
                        title={
                            narration.isVoiceSupported ? undefined : 'Voice narration is not supported in this browser'
                        }
                        className="rounded border border-slate-700 px-3 py-1 text-xs text-slate-300 disabled:opacity-40"
                    >
                        {narration.isVoiceSupported
                            ? voiceEnabled
                                ? '🔊 Voice on'
                                : '🔇 Voice off'
                            : '🔇 Voice unsupported'}
                    </button>
                </div>

                <div className="flex flex-1 flex-col items-center justify-center gap-8 px-10 text-center">
                    <div className="relative flex h-24 w-24 items-center justify-center">
                        {narration.isNarrating && (
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-40" />
                        )}
                        <span className="relative inline-flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-3xl">
                            🤖
                        </span>
                    </div>

                    <div className="min-h-[6rem] max-w-xl">
                        {subtitle.kind === 'transition' && (
                            <p className="text-lg italic text-slate-300">{subtitle.text}</p>
                        )}
                        {subtitle.kind === 'welcome' && <p className="text-lg text-slate-300">{subtitle.text}</p>}
                        {subtitle.kind === 'question' && (
                            <p className="text-2xl font-medium text-white">{subtitle.text}</p>
                        )}
                    </div>

                    {isTransitioning && (
                        <button
                            type="button"
                            onClick={() => narration.skip()}
                            className="text-sm text-slate-400 underline"
                        >
                            Continue now
                        </button>
                    )}
                </div>
            </div>

            {/* Right: candidate panel */}
            <div className="flex w-full max-w-md flex-shrink-0 flex-col border-l border-slate-800 p-6">
                <h2 className="mb-4 text-lg font-semibold">Your Answer</h2>

                {isServerWakingUp && (
                    <p className="mb-3 text-sm text-yellow-400">
                        Waking up the server, this can take a moment...
                    </p>
                )}

                {isAnswering ? (
                    <form onSubmit={handleSubmit(onSubmitAnswer)} className="flex flex-1 flex-col justify-between gap-3">
                        <textarea
                            {...register('transcript')}
                            rows={10}
                            placeholder="Type your answer, or use the mic..."
                            className="w-full flex-1 resize-none rounded border border-slate-700 bg-slate-800 px-3 py-2"
                        />

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={toggleMic}
                                    disabled={!speechRecognition.isSupported}
                                    title={
                                        speechRecognition.isSupported
                                            ? 'Toggle voice input'
                                            : 'Voice input is not supported in this browser'
                                    }
                                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium disabled:opacity-40 ${speechRecognition.isListening ? 'animate-pulse bg-red-600' : 'bg-slate-700'
                                        }`}
                                >
                                    {speechRecognition.isListening ? '⏹ Stop' : '🎤 Speak'}
                                </button>
                                <span className="text-xs text-slate-500">{transcriptValue?.length ?? 0} / 5000</span>
                            </div>

                            {errors.transcript && <p className="text-sm text-red-400">{errors.transcript.message}</p>}

                            <button
                                type="submit"
                                disabled={answerMutation.isPending}
                                className="w-full rounded bg-blue-600 py-2 font-medium disabled:opacity-50"
                            >
                                {answerMutation.isPending ? 'Submitting...' : 'Submit answer'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="flex flex-1 items-center justify-center">
                        <p className="text-sm text-slate-500">Waiting for the next question...</p>
                    </div>
                )}
            </div>
        </div>
    )
}