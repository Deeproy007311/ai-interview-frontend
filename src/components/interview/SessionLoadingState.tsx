import { Link } from 'react-router-dom'

interface SessionLoadingStateProps {
    kind: 'loading' | 'error' | 'cancelled' | 'preparing' | 'generating_report' | 'stale_session' | 'resuming'
    errorMessage?: string
    isServerWakingUp?: boolean
}

export default function SessionLoadingState({
    kind,
    errorMessage,
    isServerWakingUp,
}: SessionLoadingStateProps) {
    if (kind === 'loading') {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 text-slate-900 space-y-4">
                <div className="h-12 w-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
                <p className="text-slate-600 font-medium text-sm">Loading interview session...</p>
            </div>
        )
    }

    if (kind === 'error') {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 text-slate-900 p-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 text-3xl border border-red-200">
                    ⚠️
                </div>
                <h2 className="text-xl font-bold text-slate-900">Session Error</h2>
                <p className="text-slate-600 text-sm max-w-sm">{errorMessage || 'Could not load this interview.'}</p>
                <Link
                    to="/dashboard"
                    className="mt-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-700 transition-all"
                >
                    Back to Dashboard
                </Link>
            </div>
        )
    }

    if (kind === 'cancelled') {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 text-slate-900 p-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 text-3xl border border-slate-200">
                    🚫
                </div>
                <h2 className="text-xl font-bold text-slate-900">Interview Cancelled</h2>
                <p className="text-slate-600 text-sm">This interview session has been cancelled.</p>
                <Link
                    to="/dashboard"
                    className="mt-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-700 transition-all"
                >
                    Back to Dashboard
                </Link>
            </div>
        )
    }
    if (kind === 'resuming') {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 text-slate-900 p-6 text-center space-y-2">
                <div className="h-12 w-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
                <h2 className="text-xl font-bold text-slate-900">Resuming Your Interview</h2>
                <p className="text-slate-600 text-sm max-w-sm">
                    Restoring your session, please wait a moment...
                </p>
            </div>
        )
    }
    if (kind === 'stale_session') {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 text-slate-900 p-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 text-3xl border border-indigo-200">
                    🔄
                </div>
                <h2 className="text-xl font-bold text-slate-900">Active Session In Progress Elsewhere</h2>
                <p className="max-w-md text-slate-600 text-sm leading-relaxed">
                    This interview is in progress, but its current question state is active in another browser tab. Please return to the original tab or back to dashboard.
                </p>
                <Link
                    to="/dashboard"
                    className="mt-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-700 transition-all"
                >
                    Back to Dashboard
                </Link>
            </div>
        )
    }

    if (kind === 'preparing') {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 text-slate-900 p-6 text-center space-y-2">
                <div className="relative flex h-16 w-16 items-center justify-center">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-40" />
                    <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-2xl text-white">
                        🤖
                    </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">Initializing AI Interviewer...</h2>
                <p className="text-slate-600 text-sm max-w-sm">
                    Setting up questions, voice synthesis, and rubric models.
                </p>
                {isServerWakingUp && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 font-medium">
                        ⚡ Waking up backend server, this can take up to 60 seconds...
                    </div>
                )}
            </div>
        )
    }

    if (kind === 'generating_report') {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 text-slate-900 p-6 text-center space-y-2">
                <div className="h-14 w-14 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin" />
                <h2 className="text-xl font-bold text-slate-900">Generating Evaluation Scorecard</h2>
                <p className="text-slate-600 text-sm max-w-sm">
                    Calculating technical clarity scores, missed concepts, and model answers...
                </p>
            </div>
        )
    }

    return null
}
