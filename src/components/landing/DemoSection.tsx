import { useState } from 'react'

type DemoRoleId = 'frontend' | 'system' | 'hr'

interface DemoData {
    role: string
    question: string
    candidateAnswer: string
    score: string
    feedback: string
    tags: string[]
}

const demoQuestions: Record<DemoRoleId, DemoData> = {
    frontend: {
        role: 'Senior React Developer',
        question: 'How do you optimize render performance in a large React 19 application with complex state trees?',
        candidateAnswer:
            'I focus on state colocation, using memoized selectors, leveraging React Server Components for heavy data fetching, and profiling component re-renders using React DevTools.',
        score: '9.5/10',
        feedback:
            'Excellent response! Highlighted state colocation and RSCs correctly. Minor suggestion: mention useTransition for non-blocking UI updates.',
        tags: ['React 19', 'Performance', 'State Management'],
    },
    system: {
        role: 'Distributed Systems Engineer',
        question: 'Explain how you would design a rate limiter to handle 100k requests per second across multiple regions.',
        candidateAnswer:
            'I would use a distributed Token Bucket algorithm backed by Redis Cluster with local memory caching for sub-millisecond evaluation, using sliding windows for accuracy.',
        score: '9.8/10',
        feedback: 'Spot-on architectural choices. Great mention of multi-region synchronization and token bucket mechanics.',
        tags: ['System Design', 'Redis', 'High Availability'],
    },
    hr: {
        role: 'Engineering Manager / Lead',
        question: 'Tell me about a time when you had to resolve a high-stakes technical disagreement within your team.',
        candidateAnswer:
            'I established an objective evaluation framework based on benchmarks, user impact, and maintenance costs rather than opinions, holding an architecture review to reach consensus.',
        score: '9.2/10',
        feedback: 'Strong leadership traits demonstrated. Clear STAR method framework used with actionable metrics.',
        tags: ['Behavioral', 'Leadership', 'Conflict Resolution'],
    },
}

const roleButtons: { id: DemoRoleId; label: string }[] = [
    { id: 'frontend', label: '⚛️ React Frontend' },
    { id: 'system', label: '🌐 System Design' },
    { id: 'hr', label: '🤝 Behavioral / Management' },
]

const soundWaveHeights = [40, 75, 30, 90, 60, 100, 45, 80, 60, 30, 95, 70, 40]

export default function DemoSection() {
    const [selectedRole, setSelectedRole] = useState<DemoRoleId>('frontend')
    const demo = demoQuestions[selectedRole]

    return (
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

                {/* Role Selector */}
                <div className="flex justify-center gap-3 mb-10 flex-wrap">
                    {roleButtons.map((role) => (
                        <button
                            key={role.id}
                            onClick={() => setSelectedRole(role.id)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                selectedRole === role.id
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40'
                                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                        >
                            {role.label}
                        </button>
                    ))}
                </div>

                {/* Demo Card */}
                <div className="max-w-4xl mx-auto rounded-3xl border border-slate-800 bg-slate-800/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700/80 pb-6 mb-6">
                        <div>
                            <span className="text-xs font-mono uppercase tracking-wider text-indigo-400">Target Role</span>
                            <h3 className="text-xl font-bold text-white">{demo.role}</h3>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {demo.tags.map((tag) => (
                                <span key={tag} className="text-xs bg-slate-700 text-slate-300 px-3 py-1 rounded-full font-medium">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Question */}
                    <div className="mb-6 rounded-2xl bg-slate-900/90 p-5 border border-slate-700/60">
                        <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider block mb-2">
                            Interviewer Question:
                        </span>
                        <p className="text-base sm:text-lg font-medium text-slate-100">{demo.question}</p>
                    </div>

                    {/* Audio Wave Simulator */}
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
                        <div className="flex items-end gap-1 h-8 px-4 py-1 bg-slate-900 rounded-lg">
                            {soundWaveHeights.map((h, i) => (
                                <div
                                    key={i}
                                    style={{ height: `${h}%` }}
                                    className="w-1 bg-indigo-400 rounded-full animate-pulse"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Transcript & Score */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        <div className="md:col-span-8 space-y-2">
                            <span className="text-xs text-slate-400 font-semibold uppercase">Transcribed Answer:</span>
                            <p className="text-sm text-slate-300 italic bg-slate-900/50 p-4 rounded-xl border border-slate-700/40">
                                "{demo.candidateAnswer}"
                            </p>
                        </div>
                        <div className="md:col-span-4 rounded-xl bg-slate-900/90 p-5 border border-slate-700 flex flex-col justify-between">
                            <div>
                                <span className="text-xs text-slate-400 font-semibold uppercase block mb-1">AI Evaluated Score</span>
                                <span className="text-3xl font-extrabold text-emerald-400">{demo.score}</span>
                            </div>
                            <p className="text-xs text-slate-400 mt-3 border-t border-slate-800 pt-3">{demo.feedback}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
