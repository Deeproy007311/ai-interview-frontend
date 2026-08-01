import { Link } from 'react-router-dom'

interface SessionHeaderProps {
    currentQuestionNumber?: number
    totalQuestions?: number
    section?: string
    elapsedSeconds?: number
    targetDurationMinutes?: number
    onExitRequest?: () => void
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
    targetDurationMinutes,
    onExitRequest,
}: SessionHeaderProps) {
    const progressPercent = currentQuestionNumber
        ? Math.round((currentQuestionNumber / totalQuestions) * 100)
        : 0

    const hasTarget = typeof targetDurationMinutes === 'number' && targetDurationMinutes > 0
    const totalTargetSeconds = hasTarget ? targetDurationMinutes * 60 : 0
    const remainingSeconds = hasTarget ? Math.max(0, totalTargetSeconds - elapsedSeconds) : 0
    const isTimeUp = hasTarget && remainingSeconds === 0

    return (
        <header className="flex h-14 items-center justify-between border-b border-slate-200/80 bg-white px-6 text-slate-800 shrink-0 select-none">
            {/* Left: Exit Interview button */}
            {onExitRequest ? (
                <button
                    type="button"
                    onClick={onExitRequest}
                    className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Exit interview</span>
                </button>
            ) : (
                <Link
                    to="/dashboard"
                    className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Exit interview</span>
                </Link>
            )}

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

            {/* Right: Timer Clock / Countdown */}
            <div className="flex items-center gap-2 text-xs sm:text-sm font-mono font-medium">
                {isTimeUp ? (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white font-bold text-xs animate-pulse shadow-sm">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Time's Up! Submit answer</span>
                    </div>
                ) : hasTarget ? (
                    <div
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs ${
                            remainingSeconds <= 60
                                ? 'bg-red-50 text-red-600 border-red-200 font-bold animate-pulse'
                                : remainingSeconds <= 300
                                ? 'bg-amber-50 text-amber-700 border-amber-200 font-semibold'
                                : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                    >
                        <svg
                            className={`w-3.5 h-3.5 ${
                                remainingSeconds <= 60
                                    ? 'text-red-500'
                                    : remainingSeconds <= 300
                                    ? 'text-amber-500'
                                    : 'text-slate-400'
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{formatTimer(remainingSeconds)} remaining</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-1.5 text-slate-600">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{formatTimer(elapsedSeconds)}</span>
                    </div>
                )}
            </div>
        </header>
    )
}
