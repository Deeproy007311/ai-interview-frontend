import Spinner from '@/components/ui/Spinner'

interface LeaveInterviewModalProps {
    isOpen: boolean
    isDeleting: boolean
    onConfirm: () => void
    onCancel: () => void
}

export default function LeaveInterviewModal({
    isOpen,
    isDeleting,
    onConfirm,
    onCancel,
}: LeaveInterviewModalProps) {
    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150"
            onClick={isDeleting ? undefined : onCancel}
        >
            <div
                className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Top accent bar */}
                <div className="h-1 w-full bg-red-500" />

                <div className="p-6 sm:p-8 space-y-5">
                    {/* Icon + heading */}
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-900 leading-snug">
                                Leave Interview?
                            </h2>
                            <p className="mt-1 text-sm text-slate-500 leading-relaxed">
                                If you leave now, this interview will be{' '}
                                <span className="font-semibold text-red-600">permanently deleted</span>{' '}
                                along with all questions and any answers you may have given.
                                Your progress will not be saved and no report will be generated.
                            </p>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-slate-100" />

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3">
                        <button
                            type="button"
                            disabled={isDeleting}
                            onClick={onCancel}
                            className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
                        >
                            Go Back
                        </button>
                        <button
                            type="button"
                            disabled={isDeleting}
                            onClick={onConfirm}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors disabled:opacity-70 shadow-sm"
                        >
                            {isDeleting ? (
                                <>
                                    <Spinner size="sm" />
                                    <span>Deleting…</span>
                                </>
                            ) : (
                                <span>Leave & Delete</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
