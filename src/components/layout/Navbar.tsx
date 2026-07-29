import { Link, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { useInterviewStore } from '@/store/interviewStore'
import { useMe } from '@/hooks/useAuth'

export default function Navbar() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { data: user } = useMe()
    const logout = useAuthStore((s) => s.logout)
    const resetSession = useInterviewStore((s) => s.reset)

    const handleLogout = () => {
        // Clears the persisted interview session and the entire React Query
        // cache on the way out — without this, a second account logging in
        // on the same device in the same tab session could briefly see the
        // previous user's cached interviews/report data before a refetch.
        resetSession()
        logout()
        queryClient.clear()
        navigate('/')
    }

    return (
        <nav className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-900 px-6 py-4 text-white">
            <Link to="/dashboard" className="text-lg font-bold">
                AI Interview System
            </Link>
            <div className="flex flex-wrap items-center gap-4 text-sm">
                <Link to="/dashboard" className="text-slate-300 hover:text-white">
                    Dashboard
                </Link>
                <Link to="/interviews/new" className="text-slate-300 hover:text-white">
                    New Interview
                </Link>
                <Link to="/interviews/history" className="text-slate-300 hover:text-white">
                    History
                </Link>
                <Link to="/resume/upload" className="text-slate-300 hover:text-white">
                    Resume
                </Link>
                {user && <span className="text-slate-500">{user.name}</span>}
                <button
                    onClick={handleLogout}
                    className="rounded bg-slate-800 px-3 py-1.5 text-slate-300 hover:bg-slate-700"
                >
                    Log out
                </button>
            </div>
        </nav>
    )
}