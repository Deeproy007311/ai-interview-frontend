import { useState } from 'react'

interface FaqItem {
    q: string
    a: string
}

const faqs: FaqItem[] = [
    {
        q: 'How realistic are the AI mock interview questions?',
        a: 'Our AI model is trained on thousands of verified technical interview rubrics across System Design, Data Structures, React/Node frontend, and behavioral STAR questions.',
    },
    {
        q: 'Is my resume and voice data kept private?',
        a: 'Yes. Your uploaded resume and audio streams are encrypted end-to-end and strictly used for your active session generation. We never sell or share user data.',
    },
    {
        q: 'Can I practice specific tech stacks like React, Go, or AWS?',
        a: 'Absolutely. You can select your exact target role and stack during session creation, or let the AI auto-detect it from your uploaded resume.',
    },
    {
        q: 'How does the free tier work?',
        a: 'You can complete your first mock interview sessions completely free to test out the voice AI, report card, and resume parser.',
    },
]

export default function FaqSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i)

    return (
        <section id="faq" className="py-24 bg-white border-t border-slate-200">
            <div className="mx-auto max-w-4xl px-6">
                <div className="text-center mb-16">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Got questions? We have answers.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div
                            key={i}
                            className="rounded-2xl border border-slate-200 bg-slate-50/50 overflow-hidden transition-colors"
                        >
                            <button
                                onClick={() => toggle(i)}
                                className="w-full flex items-center justify-between px-6 py-5 text-left font-semibold text-slate-900 hover:text-indigo-600 transition-colors"
                            >
                                <span>{faq.q}</span>
                                <span className="text-indigo-600 font-bold text-xl ml-4">
                                    {openIndex === i ? '−' : '+'}
                                </span>
                            </button>
                            {openIndex === i && (
                                <div className="px-6 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-200/60 pt-4 bg-white">
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
