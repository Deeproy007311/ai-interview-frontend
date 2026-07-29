import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useMe } from '@/hooks/useAuth'

export default function LandingNavbar() {
    const token = useAuthStore((s) => s.token)
    const { data: user } = useMe()

    return (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200/80 transition-all">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                {/* Brand Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-500 text-white font-bold shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 3a7 7 0 0 0-7 7c0 3.866 3.134 7 7 7s7-3.134 7-7a7 7 0 0 0-7-7zm-1 3.5a1 1 0 0 1 2 0v3.25l2.25 1.3a1 1 0 0 1-1 1.732l-2.75-1.588A1 1 0 0 1 11 11.5V8.5z" />
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
    )
}
