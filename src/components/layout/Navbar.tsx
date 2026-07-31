import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { useInterviewStore } from '@/store/interviewStore'
import { useMe } from '@/hooks/useAuth'
import DeleteAccountModal from '@/components/profile/DeleteAccountModal'
import { toast } from 'sonner'

export default function Navbar() {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    const location = useLocation()
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const token = useAuthStore((s) => s.token)
    const logout = useAuthStore((s) => s.logout)
    const resetSession = useInterviewStore((s) => s.reset)
    const { data: user } = useMe()

    const isLanding = location.pathname === '/'

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleLogout = () => {
        setIsMenuOpen(false)
        resetSession()
        logout()
        queryClient.clear()
        toast.info('Logged out successfully')
        navigate('/')
    }

    const openDeleteModal = () => {
        setIsMenuOpen(false)
        setIsDeleteModalOpen(true)
    }

    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U'

    return (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-white/85 border-b border-slate-200/80 transition-all shadow-xs">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3.5">
                {/* Brand Logo */}
                <Link to="/" className="flex items-center gap-2.5 group">
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
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
                    {isLanding ? (
                        <>
                            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
                            <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How It Works</a>
                            <a href="#demo" className="hover:text-indigo-600 transition-colors">Live Preview</a>
                            <a href="#testimonials" className="hover:text-indigo-600 transition-colors">Testimonials</a>
                            <a href="#faq" className="hover:text-indigo-600 transition-colors">FAQ</a>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/dashboard"
                                className={`transition-colors ${
                                    location.pathname === '/dashboard'
                                        ? 'text-indigo-600 font-semibold'
                                        : 'hover:text-indigo-600'
                                }`}
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/interviews/new"
                                className={`transition-colors ${
                                    location.pathname === '/interviews/new'
                                        ? 'text-indigo-600 font-semibold'
                                        : 'hover:text-indigo-600'
                                }`}
                            >
                                New Interview
                            </Link>
                            <Link
                                to="/interviews/history"
                                className={`transition-colors ${
                                    location.pathname === '/interviews/history'
                                        ? 'text-indigo-600 font-semibold'
                                        : 'hover:text-indigo-600'
                                }`}
                            >
                                History
                            </Link>
                            <Link
                                to="/resume/upload"
                                className={`transition-colors ${
                                    location.pathname === '/resume/upload'
                                        ? 'text-indigo-600 font-semibold'
                                        : 'hover:text-indigo-600'
                                }`}
                            >
                                Resume
                            </Link>
                        </>
                    )}
                </nav>

                {/* Auth & User Profile Actions */}
                <div className="flex items-center gap-3 text-sm font-medium">
                    {token ? (
                        <div className="relative" ref={menuRef}>
                            {/* Profile Dropdown Trigger */}
                            <button
                                onClick={() => setIsMenuOpen((prev) => !prev)}
                                className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-all shadow-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 active:scale-[0.98]"
                                aria-expanded={isMenuOpen}
                                aria-haspopup="true"
                            >
                                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white font-extrabold text-xs shadow-xs">
                                    {userInitial}
                                </div>
                                <span className="hidden sm:inline-block text-xs font-semibold text-slate-800 max-w-[120px] truncate">
                                    {user?.name || 'Account'}
                                </span>
                                <svg
                                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                                        isMenuOpen ? 'rotate-180' : ''
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {isMenuOpen && (
                                <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-2xl bg-white p-2 shadow-xl border border-slate-200/90 z-50 animate-in fade-in zoom-in-95 duration-100 divide-y divide-slate-100">
                                    {/* User Info Header */}
                                    <div className="px-3 py-2.5 space-y-0.5">
                                        <p className="text-xs font-bold text-slate-900 truncate">
                                            {user?.name || 'Candidate Account'}
                                        </p>
                                        <p className="text-[11px] text-slate-500 truncate">
                                            {user?.email || 'User'}
                                        </p>
                                    </div>

                                    {/* Primary Links */}
                                    <div className="py-1">
                                        <Link
                                            to="/dashboard"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition-colors"
                                        >
                                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                            </svg>
                                            Candidate Dashboard
                                        </Link>
                                        <Link
                                            to="/resume/upload"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition-colors"
                                        >
                                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Resume File & Context
                                        </Link>
                                    </div>

                                    {/* Logout & Delete Actions */}
                                    <div className="py-1">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors"
                                        >
                                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Sign out
                                        </button>
                                        <button
                                            onClick={openDeleteModal}
                                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-colors"
                                        >
                                            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Delete Account & Data
                                        </button>
                                    </div>
                                </div>
                            )}
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
                                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-white shadow-md shadow-indigo-600/25 transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/35 active:scale-[0.98]"
                            >
                                Start Free
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* Modal for Deleting Account */}
            <DeleteAccountModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
            />
        </header>
    )
}