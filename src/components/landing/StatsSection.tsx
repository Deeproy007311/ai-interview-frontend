const stats = [
    { value: '50,000+', label: 'Mock Sessions Conducted', bordered: true },
    { value: '94.2%', label: 'Interview Offer Pass Rate', bordered: true },
    { value: '< 30s', label: 'Instant AI Feedback Generation', bordered: true },
    { value: '120+', label: 'Tech Stacks Supported', bordered: false },
]

export default function StatsSection() {
    return (
        <section className="py-16 bg-slate-900 text-white">
            <div className="mx-auto max-w-7xl px-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className={`p-4 ${stat.bordered ? 'border-r border-slate-800' : ''}`}
                        >
                            <div className="text-4xl sm:text-5xl font-extrabold text-indigo-400 mb-2">
                                {stat.value}
                            </div>
                            <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
