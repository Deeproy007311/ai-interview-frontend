import { type UseFormRegister, type FieldErrors } from 'react-hook-form'
import type { AnswerFormValues } from '@/schemas/interview.schema'

interface AnswerPanelProps {
    isAnswering: boolean
    isSubmitting: boolean
    transcriptValue: string
    isListening: boolean
    isSpeechSupported: boolean
    isServerWakingUp: boolean
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
    isSpeechSupported,
    isServerWakingUp,
    register,
    errors,
    onToggleMic,
    onSubmit,
}: AnswerPanelProps) {
    return (
        <div className="flex w-full max-w-md shrink-0 flex-col border-l border-slate-200 bg-white p-6 text-slate-900 justify-between shadow-xs">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold text-sm">
                        ✍️
                    </div>
                    <h2 className="text-base font-bold text-slate-900">Your Answer</h2>
                </div>
                <span className="text-xs font-mono text-slate-400 font-medium">
                    {transcriptValue?.length ?? 0} / 5000 chars
                </span>
            </div>

            {isServerWakingUp && (
                <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                    Waking up AI evaluation engine...
                </div>
            )}

            {isAnswering ? (
                <form onSubmit={onSubmit} className="flex flex-1 flex-col justify-between gap-4">
                    {/* Speech / Text Transcript Input */}
                    <div className="relative flex-1 flex flex-col">
                        <textarea
                            {...register('transcript')}
                            rows={10}
                            placeholder="Type your answer, or use the mic to speak aloud..."
                            className="w-full flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-600 focus:bg-white focus:ring-1 focus:ring-indigo-600 transition-all leading-relaxed"
                        />

                        {/* Mic Recording Banner */}
                        {isListening && (
                            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl bg-red-500 text-white border border-red-600 px-4 py-2 shadow-md">
                                <div className="flex items-center gap-2">
                                    <span className="flex h-3 w-3 rounded-full bg-white animate-ping" />
                                    <span className="text-xs font-bold">Listening to microphone...</span>
                                </div>
                                <div className="flex items-end gap-1 h-4">
                                    {[50, 90, 40, 100, 60, 80].map((h, i) => (
                                        <div
                                            key={i}
                                            style={{ height: `${h}%` }}
                                            className="w-1 bg-white rounded-full animate-pulse"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {errors.transcript && (
                        <p className="text-xs font-semibold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
                            ⚠️ {errors.transcript.message}
                        </p>
                    )}

                    {/* Mic & Submit Buttons */}
                    <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between gap-3">
                            <button
                                type="button"
                                onClick={onToggleMic}
                                disabled={!isSpeechSupported}
                                title={
                                    isSpeechSupported
                                        ? 'Toggle Speech Recognition'
                                        : 'Voice input is not supported in this browser'
                                }
                                className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs font-bold transition-all disabled:opacity-40 active:scale-[0.98] ${
                                    isListening
                                        ? 'bg-red-600 text-white shadow-md shadow-red-600/30 animate-pulse'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                                }`}
                            >
                                <span className="text-base">{isListening ? '⏹' : '🎙️'}</span>
                                <span>{isListening ? 'Stop Mic Input' : 'Speak Answer'}</span>
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-md shadow-indigo-600/25 transition-all hover:bg-indigo-700 disabled:opacity-50 active:scale-[0.98]"
                        >
                            {isSubmitting ? 'Evaluating Response...' : 'Submit Answer →'}
                        </button>
                    </div>

                    {/* Pro Tip */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-[11px] text-slate-600 flex items-center gap-2">
                        <span>💡</span>
                        <span>
                            <strong>Pro Tip:</strong> Clearly articulate your solution structure and trade-offs before submitting.
                        </span>
                    </div>
                </form>
            ) : (
                <div className="flex flex-1 flex-col items-center justify-center text-center p-6 space-y-3">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-lg animate-pulse">
                        ⏳
                    </div>
                    <p className="text-sm font-medium text-slate-500">
                        Waiting for AI interviewer to complete question...
                    </p>
                </div>
            )}
        </div>
    )
}
