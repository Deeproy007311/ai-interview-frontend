import { Link } from 'react-router-dom'

interface SessionHeaderProps {
    currentQuestionNumber?: number
    totalQuestions?: number
    section?: string
    voiceEnabled: boolean
    isVoiceSupported: boolean
    onToggleVoice: () => void
}

export default function SessionHeader({
    currentQuestionNumber,
    totalQuestions = 6,
    section,
    voiceEnabled,
    isVoiceSupported,
    onToggleVoice,
}: SessionHeaderProps) {
    const progressPercent = currentQuestionNumber
        ? Math.round((currentQuestionNumber / totalQuestions) * 100)
        : 0

    return (
        <header className="flex h-16 items-center justify-between border-b border-slate-800/80 bg-slate-950 px-6 text-white shrink-0">
            {/* Left: Logo & Live Status */}
            <div className="flex items-center gap-4">
                <Link to="/dashboard" className="flex items-center gap-2.5 group">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white font-bold shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 3a7 7 0 0 0-7 7c0 3.866 3.134 7 7 7s7-3.134 7-7a7 7 0 0 0-7-7zm-1 3.5a1 1 0 0 1 2 0v3.25l2.25 1.3a1 1 0 0 1-1 1.732l-2.75-1.588A1 1 0 0 1 11 11.5V8.5z" />
                        </svg>
                    </div>
                    <span className="text-lg font-bold tracking-tight text-white hidden sm:inline">
                        Interview<span className="text-indigo-400">AI</span>
                    </span>
                </Link>

                <div className="h-4 w-px bg-slate-800 hidden sm:block" />

                {/* Question Progress Tracker */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-semibold text-slate-300">
                            {currentQuestionNumber
                                ? `Question ${currentQuestionNumber} of ${totalQuestions}`
                                : 'Session Active'}
                        </span>
                    </div>

                    {/* Progress Bar */}
                    {currentQuestionNumber && (
                        <div className="w-24 bg-slate-800 rounded-full h-1.5 hidden md:block overflow-hidden">
                            <div
                                className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    )}

                    {section && (
                        <span className="hidden lg:inline-flex text-xs font-mono capitalize px-2.5 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-slate-300">
                            {section}
                        </span>
                    )}
                </div>
            </div>

            {/* Right: Audio Narration Toggle & Exit */}
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={onToggleVoice}
                    disabled={!isVoiceSupported}
                    className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition-all ${
                        isVoiceSupported
                            ? voiceEnabled
                                ? 'border-indigo-500/50 bg-indigo-950/80 text-indigo-300 hover:bg-indigo-900'
                                : 'border-slate-700 bg-slate-800 text-slate-400 hover:text-white'
                            : 'border-slate-800 bg-slate-900 text-slate-600 opacity-50 cursor-not-allowed'
                    }`}
                >
                    <span className="text-sm">{voiceEnabled ? '🔊' : '🔇'}</span>
                    <span className="hidden sm:inline">{voiceEnabled ? 'Voice AI On' : 'Voice Muted'}</span>
                </button>

                <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
                >
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Exit</span>
                </Link>
            </div>
        </header>
    )
}
