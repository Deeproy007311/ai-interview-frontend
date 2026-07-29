import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export default function HeroSection() {
    const token = useAuthStore((s) => s.token)

    return (
        <section className="relative pt-20 pb-24 md:pt-28 md:pb-32 overflow-hidden">
            {/* Glow Spotlights */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-200/50 via-blue-200/40 to-purple-200/30 blur-3xl rounded-full pointer-events-none -z-10" />

            <div className="mx-auto max-w-5xl px-6 text-center">
                {/* Announcement Pill */}
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-4 py-1.5 text-xs font-semibold text-indigo-700 shadow-xs mb-8">
                    <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
                    Next-Gen AI Mock Interview Platform 2.0
                    <span className="text-slate-400">|</span>
                    <span className="text-indigo-900 font-bold">Voice-Driven Evaluation →</span>
                </div>

                {/* Hero Title */}
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6">
                    Ace your next tech interview with{' '}
                    <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-800 bg-clip-text text-transparent">
                        real-time AI feedback
                    </span>
                </h1>

                {/* Hero Subtitle */}
                <p className="mx-auto max-w-2xl text-lg sm:text-xl text-slate-600 leading-relaxed mb-10">
                    Practice system design, coding depth, and behavioral questions with an interactive voice AI. Get personalized rubrics, resume matching, and detailed scorecards before the actual call.
                </p>

                {/* Hero CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                    {token ? (
                        <Link
                            to="/dashboard"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-indigo-600/30 transition-all hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Launch Your Dashboard
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>
                    ) : (
                        <>
                            <Link
                                to="/register"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-indigo-600/30 transition-all hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Start Free Interview Now
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                            <a
                                href="#demo"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-8 py-4 text-base font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-400"
                            >
                                <svg className="w-5 h-5 text-indigo-600 fill-current" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                                Watch Live Demo
                            </a>
                        </>
                    )}
                </div>

                {/* Social proof rating */}
                <div className="flex items-center justify-center gap-3 text-xs sm:text-sm text-slate-500">
                    <div className="flex text-amber-400">{'★'.repeat(5)}</div>
                    <span className="font-semibold text-slate-700">4.9 / 5.0</span>
                    <span>rated by 10,000+ software engineers</span>
                </div>
            </div>
        </section>
    )
}
