import { useState } from 'react'

type TabId = 'voice' | 'resume' | 'analytics'

interface TabContent {
    badge: string
    title: string
    description: string
    bullets: string[]
}

const tabContent: Record<TabId, TabContent> = {
    voice: {
        badge: 'NATURAL DIALOGUE & SPEECH RECOGNITION',
        title: 'Speak naturally. Receive adaptive follow-ups in real-time.',
        description:
            'Our voice AI listens to your answer, parses your technical vocabulary, and asks realistic probing follow-up questions when you gloss over edge cases or architecture details.',
        bullets: [
            'Low-latency speech-to-text recognition',
            'Adaptive follow-up questions tailored to your answer',
            'Audio pace and filler word detection',
        ],
    },
    resume: {
        badge: 'PERSONALIZED QUESTION MAPPING',
        title: 'Upload your resume once. Get questions based on your actual experience.',
        description:
            'No more generic cookie-cutter questions. The system analyzes your past projects, bullet points, and tech stack to ask deep behavioral and technical questions expected for your seniority level.',
        bullets: [
            'Automatic PDF/Text resume parser',
            'Target role customization (Frontend, Backend, System Design, Lead)',
            'Behavioral STAR-method validation',
        ],
    },
    analytics: {
        badge: 'ACTIONABLE SCORING RUBRIC',
        title: 'Comprehensive scorecards with ideal model answers.',
        description:
            'Get instant breakdown of your strengths, missing keywords, and recommended revisions. Compare your transcript with golden standard engineering answers.',
        bullets: [
            'Per-question rating metrics (1 to 10 scale)',
            'Key phrase coverage and missing concepts analysis',
            'Downloadable PDF history and session reports',
        ],
    },
}

const tabs: { id: TabId; label: string }[] = [
    { id: 'voice', label: '🎙️ Interactive Voice AI' },
    { id: 'resume', label: '📄 Resume Context Engine' },
    { id: 'analytics', label: '📊 Deep Rubric & Analytics' },
]

export default function FeaturesSection() {
    const [activeTab, setActiveTab] = useState<TabId>('voice')
    const content = tabContent[activeTab]

    return (
        <section id="features" className="py-24 bg-slate-50">
            <div className="mx-auto max-w-7xl px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3">
                        Engineered for Excellence
                    </h2>
                    <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Everything you need to master your technical interviews
                    </p>
                    <p className="mt-4 text-slate-600 text-lg">
                        Ditch generic question lists. Practice with adaptive AI that evaluates your speech, technical depth, and solution structure.
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="flex justify-center mb-12">
                    <div className="inline-flex rounded-2xl bg-slate-200/70 p-1.5 border border-slate-300/60 shadow-inner">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-3 text-sm font-semibold rounded-xl transition-all ${
                                    activeTab === tab.id
                                        ? 'bg-white text-indigo-600 shadow-md shadow-slate-300'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl">
                    {/* Left: Text Content */}
                    <div className="lg:col-span-6 space-y-6">
                        <div className="inline-block rounded-lg bg-indigo-50 px-3.5 py-1 text-xs font-bold text-indigo-600">
                            {content.badge}
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">{content.title}</h3>
                        <p className="text-slate-600 leading-relaxed">{content.description}</p>
                        <ul className="space-y-3 pt-2">
                            {content.bullets.map((item) => (
                                <li key={item} className="flex items-center gap-3 text-slate-700 text-sm font-medium">
                                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold">
                                        ✓
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right: Live Evaluation Preview Card */}
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
                                {[
                                    { label: 'Technical Clarity', pct: 96, color: 'bg-emerald-400', textColor: 'text-emerald-400' },
                                    { label: 'Communication & Pacing', pct: 92, color: 'bg-indigo-500', textColor: 'text-indigo-400' },
                                    { label: 'System Architecture Depth', pct: 98, color: 'bg-blue-400', textColor: 'text-blue-400' },
                                ].map((metric, idx) => (
                                    <div key={metric.label}>
                                        <div className={`flex justify-between items-center text-sm ${idx > 0 ? 'pt-2' : ''}`}>
                                            <span className="text-slate-300 font-medium">{metric.label}</span>
                                            <span className={`${metric.textColor} font-bold`}>{metric.pct}%</span>
                                        </div>
                                        <div className="w-full bg-slate-800 rounded-full h-2 mt-1">
                                            <div
                                                className={`${metric.color} h-2 rounded-full`}
                                                style={{ width: `${metric.pct}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
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
    )
}
