import { type UseFormRegister, type FieldErrors } from 'react-hook-form'
import type { AnswerFormValues } from '@/schemas/interview.schema'

interface AnswerPanelProps {
    isAnswering: boolean
    isSubmitting: boolean
    transcriptValue: string
    isListening: boolean
    isTranscribing?: boolean
    isSpeechSupported: boolean
    isServerWakingUp: boolean
    userName?: string
    userInitials?: string
    register: UseFormRegister<AnswerFormValues>
    errors: FieldErrors<AnswerFormValues>
    onToggleMic: () => void
    onSubmit: (e?: React.FormEvent) => void
}

export default function AnswerPanel({
    isAnswering,
    isSubmitting,
    transcriptValue,
    isListening,
    isTranscribing = false,
    isSpeechSupported,
    isServerWakingUp,
    userName = 'You',
    userInitials = 'DR',
    register,
    errors,
    onToggleMic,
    onSubmit,
}: AnswerPanelProps) {
    return (
        <div className="w-full lg:w-[440px] xl:w-[480px] shrink-0 flex flex-col gap-4">
            {/* Top Card: Candidate Profile Bar */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs tracking-wider border border-slate-300/60 shadow-xs">
                        {userInitials}
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 leading-tight">
                            {userName}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                            {isListening
                                ? 'Mic active / recording...'
                                : isTranscribing
                                    ? 'Transcribing audio...'
                                    : 'Mic ready'}
                        </p>
                    </div>
                </div>

                <div className="text-slate-400 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 00-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                </div>
            </div>

            {/* Bottom Card: Answer Input Panel */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex-1 flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-slate-900">Your answer</h2>
                    {isServerWakingUp && (
                        <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                            Waking AI engine...
                        </span>
                    )}
                </div>

                {isAnswering ? (
                    <form onSubmit={onSubmit} className="flex-1 flex flex-col justify-between gap-3">
                        {/* Speech / Text Area */}
                        <div className="relative flex-1 flex flex-col">
                            <textarea
                                {...register('transcript')}
                                rows={10}
                                placeholder="Type, or tap the mic to speak..."
                                className="w-full flex-1 min-h-[200px] sm:min-h-[260px] resize-none rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all leading-relaxed"
                            />

                            {/* Character Count & Mic Speak Button Inside Box Footer */}
                            <div className="flex items-center justify-between pt-2 px-1 text-xs text-slate-500 font-medium">
                                <span>{transcriptValue?.length ?? 0} / 5000</span>

                                <button
                                    type="button"
                                    onClick={onToggleMic}
                                    disabled={!isSpeechSupported || isTranscribing}
                                    title={
                                        !isSpeechSupported
                                            ? 'Voice input is not supported in this browser'
                                            : isTranscribing
                                                ? 'Transcribing audio...'
                                                : isListening
                                                    ? 'Stop recording'
                                                    : 'Start voice input'
                                    }
                                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-all active:scale-[0.98] disabled:opacity-40 ${
                                        isListening
                                            ? 'bg-red-500 text-white border-red-600 animate-pulse shadow-xs'
                                            : isTranscribing
                                                ? 'bg-indigo-50 text-indigo-700 border-indigo-200 animate-pulse'
                                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                    }`}
                                >
                                    <span>{isTranscribing ? '⏳' : '🎙️'}</span>
                                    <span>
                                        {isTranscribing
                                            ? 'Transcribing...'
                                            : isListening
                                                ? 'Stop'
                                                : 'Speak'}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {errors.transcript && (
                            <p className="text-xs font-medium text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
                                ⚠️ {errors.transcript.message}
                            </p>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-xl bg-white border border-slate-300 py-3 text-sm font-bold text-slate-900 shadow-xs transition-all hover:bg-slate-50 hover:border-slate-400 active:scale-[0.99] disabled:opacity-50 mt-1"
                        >
                            {isSubmitting ? 'Evaluating answer...' : 'Submit answer'}
                        </button>
                    </form>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-2">
                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 animate-pulse">
                            ⏳
                        </div>
                        <p className="text-xs font-medium text-slate-500">
                            Waiting for AI interviewer to finish question...
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

