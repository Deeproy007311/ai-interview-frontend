import { useState } from 'react'
import { useDeleteProfile } from '@/hooks/useAuth'
import Spinner from '@/components/ui/Spinner'

interface DeleteAccountModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function DeleteAccountModal({ isOpen, onClose }: DeleteAccountModalProps) {
    const [confirmText, setConfirmText] = useState('')
    const { mutate: deleteAccount, isPending } = useDeleteProfile()

    if (!isOpen) return null

    const handleConfirm = (e: React.FormEvent) => {
        e.preventDefault()
        if (confirmText.trim() !== 'DELETE' || isPending) return

        deleteAccount(undefined, {
            onSuccess: () => {
                setConfirmText('')
                onClose()
            },
        })
    }

    const handleClose = () => {
        if (isPending) return
        setConfirmText('')
        onClose()
    }

    const isConfirmed = confirmText.trim() === 'DELETE'

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-xs overflow-y-auto transition-opacity duration-200"
            onClick={handleClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-account-title"
        >
            {/* Modal Card */}
            <div
                className="relative w-full max-w-lg my-auto overflow-hidden rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-red-100 transform transition-all animate-in zoom-in-95 duration-150"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Background red gradient accent */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-red-100/50 rounded-full blur-2xl -z-10 pointer-events-none" />

                {/* Header Icon + Title */}
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 border border-red-200/80 shadow-xs">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                        </svg>
                    </div>
                    <div className="space-y-1">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                            ⚠️ Danger Zone
                        </span>
                        <h2 id="delete-account-title" className="text-xl font-extrabold text-slate-900">
                            Delete Account & Profile
                        </h2>
                    </div>
                </div>

                {/* Warning details */}
                <div className="mt-4 space-y-3">
                    <p className="text-sm text-slate-600 leading-relaxed">
                        Are you sure you want to delete your account? This action is{' '}
                        <strong className="text-red-600 font-semibold">permanent and cannot be undone</strong>.
                    </p>

                    <div className="rounded-2xl border border-red-100 bg-red-50/60 p-4 text-xs text-red-900 space-y-2">
                        <p className="font-bold flex items-center gap-1.5">
                            <span>🗑️</span> What will be permanently erased:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-red-800 leading-normal pl-1">
                            <li>Your user account profile and authentication credentials</li>
                            <li>All mock interview sessions, questions, and transcriptions</li>
                            <li>All generated AI feedback reports, rubrics, and scorecards</li>
                            <li>Your uploaded PDF resume files and parsed context</li>
                        </ul>
                    </div>

                    <form onSubmit={handleConfirm} className="space-y-4 pt-2">
                        <div className="space-y-1.5">
                            <label htmlFor="confirm-input" className="block text-xs font-semibold text-slate-700">
                                To confirm deletion, type <span className="font-mono font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">DELETE</span> below:
                            </label>
                            <input
                                id="confirm-input"
                                type="text"
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                                placeholder="Type DELETE to confirm"
                                disabled={isPending}
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-red-500 focus:outline-hidden focus:ring-2 focus:ring-red-500/20 disabled:bg-slate-100 transition-all font-mono"
                                autoFocus
                            />
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={isPending}
                                className="w-full sm:w-auto rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-all disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!isConfirmed || isPending}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-600/20 hover:bg-red-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                            >
                                {isPending ? (
                                    <>
                                        <Spinner size="sm" className="text-white" />
                                        Deleting Account...
                                    </>
                                ) : (
                                    'Delete Account Permanently'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
