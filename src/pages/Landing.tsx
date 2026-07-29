import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useMe } from '@/hooks/useAuth'

export default function Landing() {
    const token = useAuthStore((s) => s.token)
    const { data: user } = useMe()

    // Interactive Tab state
    const [activeTab, setActiveTab] = useState<'voice' | 'resume' | 'analytics'>('voice')

    // FAQ toggle state
    const [openFaq, setOpenFaq] = useState<number | null>(0)

    // Interactive Demo Question selector state
    const [selectedDemoRole, setSelectedDemoRole] = useState<'frontend' | 'system' | 'hr'>('frontend')

    const demoQuestions = {
        frontend: {
            role: 'Senior React Developer',
            question: 'How do you optimize render performance in a large React 19 application with complex state trees?',
            candidateAnswer: 'I focus on state colocation, using memoized selectors, leveraging React Server Components for heavy data fetching, and profiling component re-renders using React DevTools.',
            score: '9.5/10',
            feedback: 'Excellent response! Highlighted state colocation and RSCs correctly. Minor suggestion: mention useTransition for non-blocking UI updates.',
            tags: ['React 19', 'Performance', 'State Management']
        },
        system: {
            role: 'Distributed Systems Engineer',
            question: 'Explain how you would design a rate limiter to handle 100k requests per second across multiple regions.',
            candidateAnswer: 'I would use a distributed Token Bucket algorithm backed by Redis Cluster with local memory caching for sub-millisecond evaluation, using sliding windows for accuracy.',
            score: '9.8/10',
            feedback: 'Spot-on architectural choices. Great mention of multi-region synchronization and token bucket mechanics.',
            tags: ['System Design', 'Redis', 'High Availability']
        },
        hr: {
            role: 'Engineering Manager / Lead',
            question: 'Tell me about a time when you had to resolve a high-stakes technical disagreement within your team.',
            candidateAnswer: 'I established an objective evaluation framework based on benchmarks, user impact, and maintenance costs rather than opinions, holding an architecture review to reach consensus.',
            score: '9.2/10',
            feedback: 'Strong leadership traits demonstrated. Clear STAR method framework used with actionable metrics.',
            tags: ['Behavioral', 'Leadership', 'Conflict Resolution']
        }
    }

    const currentDemo = demoQuestions[selectedDemoRole]

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
            {/* ── Background Subtle Mesh Pattern ── */}
            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none -z-10 h-full w-full" />

            {/* ── Light Header / Navbar ── */}
            <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200/80 transition-all">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    {/* Brand Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-500 text-white font-bold shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 3a7 7 0 0 0-7 7c0 3.866 3.134 7 7 7s7-3.134 7-7a7 7 0 0 0-7-7zm-1 3.5a1 1 0 0 1 2 0v3.25l2.25 1.3a1 1 0 0 1-1 1.732l-2.75-1.588A1 1 0 0 1 11 11.5V8.5z"/>
                            </svg>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900">
                            Interview<span className="text-indigo-600">AI</span>
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                        <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
                        <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How It Works</a>
                        <a href="#demo" className="hover:text-indigo-600 transition-colors">Live Preview</a>
                        <a href="#testimonials" className="hover:text-indigo-600 transition-colors">Testimonials</a>
                        <a href="#faq" className="hover:text-indigo-600 transition-colors">FAQ</a>
                    </nav>

                    {/* Auth Actions */}
                    <div className="flex items-center gap-4 text-sm font-medium">
                        {token ? (
                            <div className="flex items-center gap-3">
                                {user && (
                                    <span className="hidden sm:inline-block text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
                                        Welcome, <strong className="text-slate-900">{user.name}</strong>
                                    </span>
                                )}
                                <Link
                                    to="/dashboard"
                                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-white shadow-md shadow-indigo-600/25 transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/35 active:scale-[0.98]"
                                >
                                    Go to Dashboard
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </Link>
                            </div>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-slate-600 hover:text-slate-900 transition-colors px-3 py-2"
                                >
                                    Sign in
                                </Link>
                                <Link
                                    to="/register"
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-white shadow-md shadow-indigo-600/25 transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/35 active:scale-[0.98]"
                                >
                                    Start Practicing Free
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* ── Hero Section (Clean Minimalist Layout) ── */}
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
                        <div className="flex text-amber-400">
                            {'★'.repeat(5)}
                        </div>
                        <span className="font-semibold text-slate-700">4.9 / 5.0</span>
                        <span>rated by 10,000+ software engineers</span>
                    </div>
                </div>
            </section>

            {/* ── Partner Companies Logos ── */}
            <section className="py-12 border-y border-slate-200/70 bg-white/60">
                <div className="mx-auto max-w-7xl px-6 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">
                        Candidates land offers at top engineering teams
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16 opacity-75 font-semibold text-slate-500 text-lg">
                        <div className="flex items-center gap-2 hover:opacity-100 transition-opacity">
                            <span className="text-slate-900 font-extrabold text-xl tracking-tight">STRIPE</span>
                        </div>
                        <div className="flex items-center gap-2 hover:opacity-100 transition-opacity">
                            <span className="text-indigo-600 font-extrabold text-xl tracking-tight">VERCEL</span>
                        </div>
                        <div className="flex items-center gap-2 hover:opacity-100 transition-opacity">
                            <span className="text-slate-900 font-extrabold text-xl tracking-tight">META</span>
                        </div>
                        <div className="flex items-center gap-2 hover:opacity-100 transition-opacity">
                            <span className="text-blue-600 font-extrabold text-xl tracking-tight">GOOGLE</span>
                        </div>
                        <div className="flex items-center gap-2 hover:opacity-100 transition-opacity">
                            <span className="text-slate-900 font-extrabold text-xl tracking-tight">DATADOG</span>
                        </div>
                        <div className="flex items-center gap-2 hover:opacity-100 transition-opacity">
                            <span className="text-purple-600 font-extrabold text-xl tracking-tight">UBER</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Stats Metric Grid ── */}
            <section className="py-16 bg-slate-900 text-white">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                        <div className="p-4 border-r border-slate-800 last:border-r-0">
                            <div className="text-4xl sm:text-5xl font-extrabold text-indigo-400 mb-2">50,000+</div>
                            <div className="text-sm text-slate-400 font-medium">Mock Sessions Conducted</div>
                        </div>
                        <div className="p-4 border-r border-slate-800 last:border-r-0">
                            <div className="text-4xl sm:text-5xl font-extrabold text-indigo-400 mb-2">94.2%</div>
                            <div className="text-sm text-slate-400 font-medium">Interview Offer Pass Rate</div>
                        </div>
                        <div className="p-4 border-r border-slate-800 last:border-r-0">
                            <div className="text-4xl sm:text-5xl font-extrabold text-indigo-400 mb-2">&lt; 30s</div>
                            <div className="text-sm text-slate-400 font-medium">Instant AI Feedback Generation</div>
                        </div>
                        <div className="p-4">
                            <div className="text-4xl sm:text-5xl font-extrabold text-indigo-400 mb-2">120+</div>
                            <div className="text-sm text-slate-400 font-medium">Tech Stacks Supported</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Feature Showcase Tabs Section ── */}
            <section id="features" className="py-24 bg-slate-50">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3">Engineered for Excellence</h2>
                        <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                            Everything you need to master your technical interviews
                        </p>
                        <p className="mt-4 text-slate-600 text-lg">
                            Ditch generic question lists. Practice with adaptive AI that evaluates your speech, technical depth, and solution structure.
                        </p>
                    </div>

                    {/* Tab Selection Navigation */}
                    <div className="flex justify-center mb-12">
                        <div className="inline-flex rounded-2xl bg-slate-200/70 p-1.5 border border-slate-300/60 shadow-inner">
                            <button
                                onClick={() => setActiveTab('voice')}
                                className={`px-6 py-3 text-sm font-semibold rounded-xl transition-all ${
                                    activeTab === 'voice'
                                        ? 'bg-white text-indigo-600 shadow-md shadow-slate-300'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                🎙️ Interactive Voice AI
                            </button>
                            <button
                                onClick={() => setActiveTab('resume')}
                                className={`px-6 py-3 text-sm font-semibold rounded-xl transition-all ${
                                    activeTab === 'resume'
                                        ? 'bg-white text-indigo-600 shadow-md shadow-slate-300'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                📄 Resume Context Engine
                            </button>
                            <button
                                onClick={() => setActiveTab('analytics')}
                                className={`px-6 py-3 text-sm font-semibold rounded-xl transition-all ${
                                    activeTab === 'analytics'
                                        ? 'bg-white text-indigo-600 shadow-md shadow-slate-300'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                📊 Deep Rubric & Analytics
                            </button>
                        </div>
                    </div>

                    {/* Tab Content Display */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl">
                        <div className="lg:col-span-6 space-y-6">
                            {activeTab === 'voice' && (
                                <>
                                    <div className="inline-block rounded-lg bg-indigo-50 px-3.5 py-1 text-xs font-bold text-indigo-600">
                                        NATURAL DIALOGUE & SPEECH RECOGNITION
                                    </div>
                                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
                                        Speak naturally. Receive adaptive follow-ups in real-time.
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        Our voice AI listens to your answer, parses your technical vocabulary, and asks realistic probing follow-up questions when you gloss over edge cases or architecture details.
                                    </p>
                                    <ul className="space-y-3 pt-2">
                                        {['Low-latency speech-to-text recognition', 'Adaptive follow-up questions tailored to your answer', 'Audio pace and filler word detection'].map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 text-slate-700 text-sm font-medium">
                                                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold">✓</div>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}

                            {activeTab === 'resume' && (
                                <>
                                    <div className="inline-block rounded-lg bg-indigo-50 px-3.5 py-1 text-xs font-bold text-indigo-600">
                                        PERSONALIZED QUESTION MAPPING
                                    </div>
                                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
                                        Upload your resume once. Get questions based on your actual experience.
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        No more generic cookie-cutter questions. The system analyzes your past projects, bullet points, and tech stack to ask deep behavioral and technical questions expected for your seniority level.
                                    </p>
                                    <ul className="space-y-3 pt-2">
                                        {['Automatic PDF/Text resume parser', 'Target role customization (Frontend, Backend, System Design, Lead)', 'Behavioral STAR-method validation'].map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 text-slate-700 text-sm font-medium">
                                                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold">✓</div>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}

                            {activeTab === 'analytics' && (
                                <>
                                    <div className="inline-block rounded-lg bg-indigo-50 px-3.5 py-1 text-xs font-bold text-indigo-600">
                                        ACTIONABLE SCORING RUBRIC
                                    </div>
                                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
                                        Comprehensive scorecards with ideal model answers.
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        Get instant breakdown of your strengths, missing keywords, and recommended revisions. Compare your transcript with golden standard engineering answers.
                                    </p>
                                    <ul className="space-y-3 pt-2">
                                        {['Per-question rating metrics (1 to 10 scale)', 'Key phrase coverage and missing concepts analysis', 'Downloadable PDF history and session reports'].map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 text-slate-700 text-sm font-medium">
                                                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold">✓</div>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>

                        {/* Native CSS Interactive Feature Preview Card */}
                        <div className="lg:col-span-6">
                            <div className="rounded-2xl border border-slate-200 bg-slate-900 text-white p-6 sm:p-8 shadow-xl space-y-6">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
                                        <span className="text-xs font-mono text-slate-400">LIVE EVALUATION ENGINE</span>
                                    </div>
                                    <span className="text-xs font-semibold text-indigo-400 bg-indigo-950/80 px-2.5 py-1 rounded-md border border-indigo-800/60">
                                        Active Model v2.4
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-300 font-medium">Technical Clarity</span>
                                        <span className="text-emerald-400 font-bold">96%</span>
                                    </div>
                                    <div className="w-full bg-slate-800 rounded-full h-2">
                                        <div className="bg-emerald-400 h-2 rounded-full w-[96%]" />
                                    </div>

                                    <div className="flex justify-between items-center text-sm pt-2">
                                        <span className="text-slate-300 font-medium">Communication & Pacing</span>
                                        <span className="text-indigo-400 font-bold">92%</span>
                                    </div>
                                    <div className="w-full bg-slate-800 rounded-full h-2">
                                        <div className="bg-indigo-500 h-2 rounded-full w-[92%]" />
                                    </div>

                                    <div className="flex justify-between items-center text-sm pt-2">
                                        <span className="text-slate-300 font-medium">System Architecture Depth</span>
                                        <span className="text-blue-400 font-bold">98%</span>
                                    </div>
                                    <div className="w-full bg-slate-800 rounded-full h-2">
                                        <div className="bg-blue-400 h-2 rounded-full w-[98%]" />
                                    </div>
                                </div>

                                <div className="rounded-xl bg-slate-800/80 p-4 border border-slate-700/60 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">🎯</span>
                                        <div>
                                            <p className="text-xs font-bold text-slate-200">Overall Interview Readiness</p>
                                            <p className="text-[11px] text-slate-400">High Confidence Level</p>
                                        </div>
                                    </div>
                                    <span className="text-lg font-black text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-lg border border-emerald-800/50">
                                        EXCELLENT
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── How It Works 3-Step Process ── */}
            <section id="how-it-works" className="py-24 bg-white border-t border-slate-200">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3">Simple 3-Step Workflow</h2>
                        <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                            From setup to session report in minutes
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                step: '01',
                                title: 'Configure Session & Resume',
                                desc: 'Select target role, difficulty level, and upload your resume or paste job description.',
                                badge: 'Setup in 30 seconds'
                            },
                            {
                                step: '02',
                                title: 'Interactive Voice Interview',
                                desc: 'Speak your answers aloud into your microphone. The AI listens and responds dynamically.',
                                badge: 'Real-time Voice AI'
                            },
                            {
                                step: '03',
                                title: 'Review Instant Report Card',
                                desc: 'Get detailed feedback, model answers, skill breakdown, and historical tracking.',
                                badge: 'Comprehensive Insights'
                            }
                        ].map((s, idx) => (
                            <div key={idx} className="relative rounded-2xl border border-slate-200 bg-slate-50/60 p-8 hover:bg-white hover:shadow-xl transition-all duration-300 group">
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-4xl font-black text-indigo-600/30 group-hover:text-indigo-600 transition-colors">
                                        {s.step}
                                    </span>
                                    <span className="text-xs font-semibold text-slate-500 bg-slate-200/80 px-2.5 py-1 rounded-md">
                                        {s.badge}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{s.title}</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Live Interactive Question Demo Preview ── */}
            <section id="demo" className="py-24 bg-slate-900 text-white">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="inline-block rounded-full bg-indigo-500/20 px-3.5 py-1 text-xs font-semibold text-indigo-300 border border-indigo-500/30 mb-4">
                            INTERACTIVE DEMO PREVIEW
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                            Experience how AI evaluates candidate answers
                        </h2>
                        <p className="mt-4 text-slate-400 text-base">
                            Click a domain below to preview a sample interview question, speech breakdown, and AI evaluation feedback.
                        </p>
                    </div>

                    {/* Role Selector Buttons */}
                    <div className="flex justify-center gap-3 mb-10 flex-wrap">
                        {[
                            { id: 'frontend', label: '⚛️ React Frontend' },
                            { id: 'system', label: '🌐 System Design' },
                            { id: 'hr', label: '🤝 Behavioral / Management' },
                        ].map((role) => (
                            <button
                                key={role.id}
                                onClick={() => setSelectedDemoRole(role.id as any)}
                                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                    selectedDemoRole === role.id
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40'
                                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                }`}
                            >
                                {role.label}
                            </button>
                        ))}
                    </div>

                    {/* Interactive Question Sandbox Card */}
                    <div className="max-w-4xl mx-auto rounded-3xl border border-slate-800 bg-slate-800/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700/80 pb-6 mb-6">
                            <div>
                                <span className="text-xs font-mono uppercase tracking-wider text-indigo-400">Target Role</span>
                                <h3 className="text-xl font-bold text-white">{currentDemo.role}</h3>
                            </div>
                            <div className="flex gap-2">
                                {currentDemo.tags.map((t, i) => (
                                    <span key={i} className="text-xs bg-slate-700 text-slate-300 px-3 py-1 rounded-full font-medium">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Question Box */}
                        <div className="mb-6 rounded-2xl bg-slate-900/90 p-5 border border-slate-700/60">
                            <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider block mb-2">Interviewer Question:</span>
                            <p className="text-base sm:text-lg font-medium text-slate-100">{currentDemo.question}</p>
                        </div>

                        {/* Candidate Audio Wave Simulator */}
                        <div className="mb-6 rounded-2xl bg-indigo-950/40 p-4 border border-indigo-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white animate-pulse">
                                    🎙️
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-indigo-200">Candidate Audio Response recorded</p>
                                    <p className="text-[11px] text-slate-400">Duration: 45 sec • 142 words/min</p>
                                </div>
                            </div>
                            {/* Simulated Sound Wave lines */}
                            <div className="flex items-end gap-1 h-8 px-4 py-1 bg-slate-900 rounded-lg">
                                {[40, 75, 30, 90, 60, 100, 45, 80, 60, 30, 95, 70, 40].map((h, i) => (
                                    <div
                                        key={i}
                                        style={{ height: `${h}%` }}
                                        className="w-1 bg-indigo-400 rounded-full animate-pulse"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Transcript & AI Score */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            <div className="md:col-span-8 space-y-2">
                                <span className="text-xs text-slate-400 font-semibold uppercase">Transcribed Answer:</span>
                                <p className="text-sm text-slate-300 italic bg-slate-900/50 p-4 rounded-xl border border-slate-700/40">
                                    "{currentDemo.candidateAnswer}"
                                </p>
                            </div>
                            <div className="md:col-span-4 rounded-xl bg-slate-900/90 p-5 border border-slate-700 flex flex-col justify-between">
                                <div>
                                    <span className="text-xs text-slate-400 font-semibold uppercase block mb-1">AI Evaluated Score</span>
                                    <span className="text-3xl font-extrabold text-emerald-400">{currentDemo.score}</span>
                                </div>
                                <p className="text-xs text-slate-400 mt-3 border-t border-slate-800 pt-3">
                                    {currentDemo.feedback}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Testimonials Grid ── */}
            <section id="testimonials" className="py-24 bg-slate-50">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3">User Success Stories</h2>
                        <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                            Loved by engineers from entry-level to staff level
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                name: 'Alex Rivera',
                                role: 'Senior Frontend Engineer @ Stripe',
                                quote: 'The real-time voice follow-up questions forced me to explain my state choices out loud. I passed all 4 rounds on my first try!',
                                avatar: '👨‍💻'
                            },
                            {
                                name: 'Sarah Chen',
                                role: 'Backend Developer @ Datadog',
                                quote: 'Uploading my resume gave me exact questions on distributed systems that came up word-for-word in my actual onsite interview.',
                                avatar: '👩‍💻'
                            },
                            {
                                name: 'Marcus Vance',
                                role: 'Fullstack Dev @ Vercel Ecosystem',
                                quote: 'The detailed scorecards pointed out my filler words and lack of edge-case coverage. Total game changer.',
                                avatar: '🚀'
                            }
                        ].map((t, idx) => (
                            <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-md hover:shadow-xl transition-shadow flex flex-col justify-between">
                                <div>
                                    <div className="flex text-amber-400 text-sm mb-4">{'★'.repeat(5)}</div>
                                    <p className="text-slate-700 text-sm leading-relaxed mb-6 italic">"{t.quote}"</p>
                                </div>
                                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-lg">
                                        {t.avatar}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">{t.name}</p>
                                        <p className="text-xs text-slate-500">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FAQ Section ── */}
            <section id="faq" className="py-24 bg-white border-t border-slate-200">
                <div className="mx-auto max-w-4xl px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3">Frequently Asked Questions</h2>
                        <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                            Got questions? We have answers.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                q: 'How realistic are the AI mock interview questions?',
                                a: 'Our AI model is trained on thousands of verified technical interview rubrics across System Design, Data Structures, React/Node frontend, and behavioral STAR questions.'
                            },
                            {
                                q: 'Is my resume and voice data kept private?',
                                a: 'Yes. Your uploaded resume and audio streams are encrypted end-to-end and strictly used for your active session generation. We never sell or share user data.'
                            },
                            {
                                q: 'Can I practice specific tech stacks like React, Go, or AWS?',
                                a: 'Absolutely. You can select your exact target role and stack during session creation, or let the AI auto-detect it from your uploaded resume.'
                            },
                            {
                                q: 'How does the free tier work?',
                                a: 'You can complete your first mock interview sessions completely free to test out the voice AI, report card, and resume parser.'
                            }
                        ].map((faq, i) => (
                            <div
                                key={i}
                                className="rounded-2xl border border-slate-200 bg-slate-50/50 overflow-hidden transition-colors"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between px-6 py-5 text-left font-semibold text-slate-900 hover:text-indigo-600 transition-colors"
                                >
                                    <span>{faq.q}</span>
                                    <span className="text-indigo-600 font-bold text-xl ml-4">
                                        {openFaq === i ? '−' : '+'}
                                    </span>
                                </button>
                                {openFaq === i && (
                                    <div className="px-6 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-200/60 pt-4 bg-white">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── High Impact Call To Action Banner ── */}
            <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-indigo-600/20 blur-3xl rounded-full pointer-events-none" />
                <div className="mx-auto max-w-5xl px-6 text-center relative z-10">
                    <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">
                        Ready to land your dream engineering offer?
                    </h2>
                    <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                        Join thousands of developers using InterviewAI to prepare smarter, speak confidently, and get hired faster.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        {token ? (
                            <Link
                                to="/dashboard"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-indigo-600/30 transition-all hover:bg-indigo-500 hover:scale-[1.02]"
                            >
                                Go to Your Dashboard →
                            </Link>
                        ) : (
                            <Link
                                to="/register"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-indigo-600/30 transition-all hover:bg-indigo-500 hover:scale-[1.02]"
                            >
                                Create Free Account Now →
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            {/* ── Light Theme Footer ── */}
            <footer className="bg-white border-t border-slate-200 py-12 text-slate-600 text-sm">
                <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold">
                                AI
                            </div>
                            <span className="text-lg font-bold text-slate-900">InterviewAI</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            The intelligent mock interview platform designed for software engineers and managers.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">Product</h4>
                        <ul className="space-y-2 text-xs">
                            <li><a href="#features" className="hover:text-indigo-600">Voice AI Coach</a></li>
                            <li><a href="#features" className="hover:text-indigo-600">Resume Parser</a></li>
                            <li><a href="#features" className="hover:text-indigo-600">Rubric Analytics</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">Resources</h4>
                        <ul className="space-y-2 text-xs">
                            <li><a href="#demo" className="hover:text-indigo-600">Interactive Demo</a></li>
                            <li><a href="#testimonials" className="hover:text-indigo-600">Success Stories</a></li>
                            <li><a href="#faq" className="hover:text-indigo-600">FAQ</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">System Status</h4>
                        <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg inline-block">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                            All AI Models Operational
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
                    <p>© {new Date().getFullYear()} InterviewAI Inc. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-slate-600">Privacy Policy</a>
                        <a href="#" className="hover:text-slate-600">Terms of Service</a>
                        <a href="#" className="hover:text-slate-600">Contact Support</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}