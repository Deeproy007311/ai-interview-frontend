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
        <div className="relative flex flex-1 flex-col items-center justify-between p-4 sm:p-8 overflow-y-auto bg-slate-950 text-white select-none">
            {/* Background Ambient Studio Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[450px] bg-indigo-600/10 blur-3xl rounded-full pointer-events-none -z-10" />

            {/* ── HD Video Stage Container (16:9 Aspect ratio window) ── */}
            <div className="relative w-full max-w-4xl my-auto flex flex-col items-center justify-center rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden backdrop-blur-xl">
                {/* Video Header Bar Overlay */}
                <div className="absolute top-0 inset-x-0 flex items-center justify-between px-6 py-4 z-20 bg-gradient-to-b from-slate-950/90 to-transparent">
                    {/* Live Stream Indicator */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 rounded-full bg-slate-900/80 border border-slate-700/60 px-3 py-1 text-[11px] font-semibold text-slate-300 backdrop-blur-md">
                            <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                            <span>LIVE HD STREAM</span>
                        </div>
                        <span className="hidden sm:inline-block text-[11px] font-mono text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/40">
                            1080p • 60 FPS
                        </span>
                    </div>

                    {/* Audio Status Equalizer */}
                    <div className="flex items-center gap-2 rounded-full bg-slate-900/80 border border-slate-700/60 px-3.5 py-1 backdrop-blur-md">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                            {isNarrating ? 'AI Interviewer Speaking' : 'Listening'}
                        </span>
                        {isNarrating ? (
                            <div className="flex items-end gap-0.5 h-3">
                                {[60, 100, 45, 90, 70].map((h, i) => (
                                    <div
                                        key={i}
                                        style={{ animationDelay: `${i * 0.15}s` }}
                                        className="w-0.5 bg-emerald-400 rounded-full animate-pulse"
                                    />
                                ))}
                            </div>
                        ) : (
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        )}
                    </div>
                </div>

                {/* Video Feed Canvas Area */}
                <div className="relative w-full h-[320px] sm:h-[400px] flex items-center justify-center bg-gradient-to-tr from-slate-950 via-indigo-950/40 to-slate-900">
                    {/* Soundwave Pulse Rings when AI is Speaking */}
                    {isNarrating && (
                        <>
                            <div className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-indigo-500/25 animate-ping pointer-events-none" />
                            <div className="absolute w-52 h-52 sm:w-64 sm:h-64 rounded-full border border-emerald-500/20 animate-pulse pointer-events-none" />
                        </>
                    )}

                    {/* Human AI Interviewer Avatar Viewport */}
                    <div className="relative z-10 flex h-48 w-48 sm:h-56 sm:w-56 items-center justify-center rounded-full bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-800 p-2 shadow-2xl border-2 border-indigo-500/30 ring-4 ring-slate-900/80">
                        <svg
                            viewBox="0 0 200 200"
                            className="h-full w-full rounded-full overflow-hidden"
                        >
                            <defs>
                                <linearGradient id="bgGradHD" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#1e1b4b" />
                                    <stop offset="100%" stopColor="#0f172a" />
                                </linearGradient>
                                <linearGradient id="skinGradHD" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#f8fafc" />
                                    <stop offset="100%" stopColor="#cbd5e1" />
                                </linearGradient>
                                <linearGradient id="suitGradHD" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#312e81" />
                                    <stop offset="100%" stopColor="#1e1b4b" />
                                </linearGradient>
                            </defs>

                            <rect width="200" height="200" fill="url(#bgGradHD)" />

                            {/* Suit Shoulders */}
                            <path
                                d="M 25 200 C 25 145, 65 135, 100 135 C 135 135, 175 145, 175 200 Z"
                                fill="url(#suitGradHD)"
                            />
                            {/* Shirt Collar & Tie */}
                            <polygon points="100,135 85,165 115,165" fill="#ffffff" opacity="0.9" />
                            <polygon points="100,145 94,195 106,195" fill="#6366f1" />

                            {/* Neck */}
                            <rect x="88" y="112" width="24" height="26" rx="4" fill="#cbd5e1" />

                            {/* Head Face */}
                            <ellipse cx="100" cy="82" rx="40" ry="46" fill="url(#skinGradHD)" />

                            {/* Hair */}
                            <path
                                d="M 58 72 C 55 42, 80 28, 100 28 C 120 28, 145 42, 142 72 C 135 48, 120 38, 100 38 C 80 38, 65 48, 58 72 Z"
                                fill="#334155"
                            />

                            {/* Eyebrows */}
                            <path d="M 72 62 Q 82 57 90 62" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                            <path d="M 110 62 Q 118 57 128 62" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" fill="none" />

                            {/* Eyes */}
                            <ellipse cx="80" cy="70" rx="4.5" ry="5.5" fill="#0f172a" />
                            <circle cx="82" cy="68" r="1.8" fill="#ffffff" />
                            <ellipse cx="120" cy="70" rx="4.5" ry="5.5" fill="#0f172a" />
                            <circle cx="122" cy="68" r="1.8" fill="#ffffff" />

                            {/* Glasses */}
                            <rect x="68" y="63" width="24" height="14" rx="4" stroke="#6366f1" strokeWidth="2" fill="none" opacity="0.9" />
                            <rect x="108" y="63" width="24" height="14" rx="4" stroke="#6366f1" strokeWidth="2" fill="none" opacity="0.9" />
                            <line x1="92" y1="69" x2="108" y2="69" stroke="#6366f1" strokeWidth="2" opacity="0.9" />

                            {/* Nose */}
                            <path d="M 100 73 L 97 86 L 103 86" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" fill="none" />

                            {/* Headset Mic */}
                            <path d="M 58 82 Q 52 108 75 110" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                            <circle cx="75" cy="110" r="3.5" fill="#6366f1" />

                            {/* ── SMOOTH LIP-SYNC MOUTH (STATIONARY CENTER, NO BOUNCE) ── */}
                            {isNarrating ? (
                                <g>
                                    <ellipse cx="100" cy="102" rx="11" ry="6" fill="#1e1b4b">
                                        <animate
                                            attributeName="ry"
                                            values="2;8;3;10;2"
                                            dur="0.3s"
                                            repeatCount="indefinite"
                                        />
                                        <animate
                                            attributeName="rx"
                                            values="9;13;10;12;9"
                                            dur="0.3s"
                                            repeatCount="indefinite"
                                        />
                                    </ellipse>
                                    <path d="M 92 98 Q 100 100 108 98" stroke="#ffffff" strokeWidth="1.5" fill="none" opacity="0.9" />
                                </g>
                            ) : (
                                <path
                                    d="M 90 101 Q 100 108 110 101"
                                    stroke="#334155"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    fill="none"
                                />
                            )}
                        </svg>
                    </div>
                </div>

                {/* Video Footer Overlay (Name Pill & Camera Details) */}
                <div className="flex items-center justify-between px-6 py-3 bg-slate-950/90 border-t border-slate-800 text-xs">
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="font-bold text-white">Alex</span>
                        <span className="text-slate-400">• Senior Tech Lead (AI Interviewer)</span>
                    </div>

                    {isTransitioning && (
                        <button
                            type="button"
                            onClick={onSkip}
                            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 underline transition-colors"
                        >
                            Skip & Continue →
                        </button>
                    )}
                </div>
            </div>

            {/* ── Closed Captions Teleprompter Subtitle Box ── */}
            <div className="w-full max-w-4xl mt-6">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-md space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                        <div className="flex items-center gap-2">
                            <span className="flex h-2 w-2 rounded-full bg-indigo-400" />
                            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-indigo-400">
                                {subtitle.kind === 'welcome' && 'Welcome Introduction'}
                                {subtitle.kind === 'transition' && 'Interviewer Feedback'}
                                {subtitle.kind === 'question' && 'Question'}
                                {!subtitle.kind && 'Interviewer Dialogue'}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            {subtitle.kind === 'question' && onReplay && (
                                <button
                                    type="button"
                                    onClick={onReplay}
                                    className="flex items-center gap-1.5 text-[11px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-800/60 px-2.5 py-0.5 rounded-md"
                                    title="Repeat question audio"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                    </svg>
                                    <span>Repeat Question</span>
                                </button>
                            )}
                            <span className="text-[11px] text-slate-500 font-mono">CC Subtitles</span>
                        </div>
                    </div>

                    <div className="min-h-[3rem] flex items-center justify-center text-center">
                        {subtitle.text ? (
                            <p className="text-sm sm:text-base font-medium text-slate-100 leading-relaxed">
                                "{subtitle.text}"
                            </p>
                        ) : (
                            <p className="text-xs text-slate-500 italic">
                                Candidate response in progress...
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
