const testimonials = [
    {
        name: 'Alex Rivera',
        role: 'Senior Frontend Engineer @ Stripe',
        quote: 'The real-time voice follow-up questions forced me to explain my state choices out loud. I passed all 4 rounds on my first try!',
        avatar: '👨‍💻',
    },
    {
        name: 'Sarah Chen',
        role: 'Backend Developer @ Datadog',
        quote: 'Uploading my resume gave me exact questions on distributed systems that came up word-for-word in my actual onsite interview.',
        avatar: '👩‍💻',
    },
    {
        name: 'Marcus Vance',
        role: 'Fullstack Dev @ Vercel Ecosystem',
        quote: 'The detailed scorecards pointed out my filler words and lack of edge-case coverage. Total game changer.',
        avatar: '🚀',
    },
]

export default function TestimonialsSection() {
    return (
        <section id="testimonials" className="py-24 bg-slate-50">
            <div className="mx-auto max-w-7xl px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3">
                        User Success Stories
                    </h2>
                    <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Loved by engineers from entry-level to staff level
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t) => (
                        <div
                            key={t.name}
                            className="rounded-2xl border border-slate-200 bg-white p-8 shadow-md hover:shadow-xl transition-shadow flex flex-col justify-between"
                        >
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
    )
}
