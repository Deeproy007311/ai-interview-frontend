interface SubtitleState {
    kind: 'welcome' | 'transition' | 'question' | null
    text: string
}

interface InterviewerAvatarProps {
    isNarrating: boolean
    subtitle: SubtitleState
    isTransitioning: boolean
    onSkip: () => void
    onReplay?: () => void
}

export default function InterviewerAvatar({
    isNarrating,
    subtitle,
    isTransitioning,
    onSkip,
    onReplay,
}: InterviewerAvatarProps) {
    return (
        <div className="relative flex flex-1 flex-col items-center justify-between p-6 rounded-2xl bg-[#f8fafc] border border-slate-200/80 overflow-hidden select-none min-h-[380px]">
            {/* Top-left: In Session Badge */}
            <div className="w-full flex items-center justify-between z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecf4e4] border border-[#d2e7c4] text-[#3b6d19] text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-[#488e1a] animate-pulse" />
                    <span>In session</span>
                </div>

                {subtitle.kind === 'question' && onReplay && (
                    <button
                        type="button"
                        onClick={onReplay}
                        className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/70 px-3 py-1 rounded-full transition-colors"
                        title="Repeat question audio"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                        <span>Repeat audio</span>
                    </button>
                )}
            </div>

            {/* Center Section: AI Core Avatar Graphic */}
            <div className="my-auto flex flex-col items-center justify-center text-center space-y-4 py-4 w-full">
                {/* Concentric circles rings around AI circle */}
                <div className="relative flex items-center justify-center">
                    {/* Active voice pulse rings */}
                    {isNarrating && (
                        <>
                            <div className="absolute w-44 h-44 sm:w-52 sm:h-52 rounded-full border border-indigo-300/40 animate-ping pointer-events-none" />
                            <div className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full border border-indigo-400/30 animate-pulse pointer-events-none" />
                        </>
                    )}

                    {/* Concentric faint background rings (matching image) */}
                    <div className="absolute w-36 h-36 sm:w-40 sm:h-40 rounded-full border border-indigo-200/70 pointer-events-none" />
                    <div className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full border border-indigo-100 pointer-events-none" />

                    {/* Core AI Avatar Circle */}
                    <div className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-indigo-50 to-blue-100 border-2 border-indigo-200 flex items-center justify-center shadow-xs">
                        <span className="text-xl sm:text-2xl font-extrabold text-indigo-900 tracking-wider font-sans">
                            AI
                        </span>
                    </div>
                </div>

                {/* Subtitle Status */}
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <span>AI interviewer</span>
                    <span>•</span>
                    <span className="capitalize">{isNarrating ? 'speaking' : 'listening'}</span>
                    {isNarrating && (
                        <div className="flex items-end gap-0.5 h-3 ml-1">
                            {[60, 100, 45, 90, 70].map((h, i) => (
                                <div
                                    key={i}
                                    style={{ animationDelay: `${i * 0.15}s` }}
                                    className="w-0.5 bg-indigo-500 rounded-full animate-pulse"
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Floating Question / Teleprompter Box */}
                <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs text-center transition-all mt-3">
                    <p className="text-sm sm:text-base font-medium text-slate-800 leading-relaxed font-sans">
                        {subtitle.text ? (
                            `"${subtitle.text}"`
                        ) : (
                            <span className="text-slate-400 italic font-normal">
                                Candidate response in progress...
                            </span>
                        )}
                    </p>

                    {isTransitioning && (
                        <button
                            type="button"
                            onClick={onSkip}
                            className="mt-3 inline-block text-xs font-semibold text-indigo-600 hover:text-indigo-700 underline transition-colors"
                        >
                            Skip & Continue →
                        </button>
                    )}
                </div>
            </div>

            <div />
        </div>
    )
}

