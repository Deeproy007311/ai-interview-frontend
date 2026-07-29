const steps = [
    {
        step: '01',
        title: 'Configure Session & Resume',
        desc: 'Select target role, difficulty level, and upload your resume or paste job description.',
        badge: 'Setup in 30 seconds',
    },
    {
        step: '02',
        title: 'Interactive Voice Interview',
        desc: 'Speak your answers aloud into your microphone. The AI listens and responds dynamically.',
        badge: 'Real-time Voice AI',
    },
    {
        step: '03',
        title: 'Review Instant Report Card',
        desc: 'Get detailed feedback, model answers, skill breakdown, and historical tracking.',
        badge: 'Comprehensive Insights',
    },
]

export default function HowItWorksSection() {
    return (
        <section id="how-it-works" className="py-24 bg-white border-t border-slate-200">
            <div className="mx-auto max-w-7xl px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3">
                        Simple 3-Step Workflow
                    </h2>
                    <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        From setup to session report in minutes
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((s) => (
                        <div
                            key={s.step}
                            className="relative rounded-2xl border border-slate-200 bg-slate-50/60 p-8 hover:bg-white hover:shadow-xl transition-all duration-300 group"
                        >
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
    )
}
