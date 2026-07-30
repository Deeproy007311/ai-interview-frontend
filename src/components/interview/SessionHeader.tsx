import { Link } from 'react-router-dom'

interface SessionHeaderProps {
    currentQuestionNumber?: number
    totalQuestions?: number
    section?: string
    elapsedSeconds?: number
}

function formatTimer(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export default function SessionHeader({
    currentQuestionNumber,
    totalQuestions = 8,
    section,
    elapsedSeconds = 0,
}: SessionHeaderProps) {
    const progressPercent = currentQuestionNumber
        ? Math.round((currentQuestionNumber / totalQuestions) * 100)
        : 0

    return (
        <header className="flex h-14 items-center justify-between border-b border-slate-200/80 bg-white px-6 text-slate-800 shrink-0 select-none">
            {/* Left: Exit Interview Link */}
            <Link
                to="/dashboard"
                className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                <span>Exit interview</span>
            </Link>

            {/* Middle: Question Tracker & Progress Bar */}
            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-600 font-medium">
                <span>
                    {currentQuestionNumber
                        ? `Question ${currentQuestionNumber} of ${totalQuestions}`
                        : 'Session active'}
                </span>

                {currentQuestionNumber && (
                    <div className="w-16 sm:w-28 h-2 bg-slate-200/80 rounded-full overflow-hidden inline-block">
                        <div
                            className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                )}

                {section && (
                    <span className="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 capitalize">
                        {section}
                    </span>
                )}
            </div>

            {/* Right: Timer Clock */}
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-600 font-mono font-medium">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{formatTimer(elapsedSeconds)}</span>
            </div>
        </header>
    )
}
