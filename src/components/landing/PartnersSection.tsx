const partners = [
    { name: 'STRIPE', colorClass: 'text-slate-900' },
    { name: 'VERCEL', colorClass: 'text-indigo-600' },
    { name: 'META', colorClass: 'text-slate-900' },
    { name: 'GOOGLE', colorClass: 'text-blue-600' },
    { name: 'DATADOG', colorClass: 'text-slate-900' },
    { name: 'UBER', colorClass: 'text-purple-600' },
]

export default function PartnersSection() {
    return (
        <section className="py-12 border-y border-slate-200/70 bg-white/60">
            <div className="mx-auto max-w-7xl px-6 text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">
                    Candidates land offers at top engineering teams
                </p>
                <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16 opacity-75 font-semibold text-slate-500 text-lg">
                    {partners.map((partner) => (
                        <div key={partner.name} className="flex items-center gap-2 hover:opacity-100 transition-opacity">
                            <span className={`${partner.colorClass} font-extrabold text-xl tracking-tight`}>
                                {partner.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
