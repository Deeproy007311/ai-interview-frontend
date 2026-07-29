import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export default function CtaSection() {
    const token = useAuthStore((s) => s.token)

    return (
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
    )
}
