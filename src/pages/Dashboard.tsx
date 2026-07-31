import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import InterviewCard from '@/components/interview/InterviewCard'
import DeleteAccountModal from '@/components/profile/DeleteAccountModal'
import { useInterviews } from '@/hooks/useInterview'
import { useMe } from '@/hooks/useAuth'
import { useMyResume } from '@/hooks/useResume'

export default function Dashboard() {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const { data: user } = useMe()
    const { data: interviews, isLoading, error } = useInterviews()
    const { data: resume } = useMyResume()

    const activeInterview = interviews?.find(
        (i) => i.status === 'pending' || i.status === 'in_progress',
    )
    const completedCount = interviews?.filter((i) => i.status === 'completed').length ?? 0
    const totalCount = interviews?.length ?? 0
    const recentInterviews = interviews?.slice(0, 5) ?? []

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
            {/* Background Subtle Mesh */}
            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none -z-10 h-full w-full" />

            <Navbar />

            <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 py-8 space-y-8">
                {/* ── Welcome Header ── */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-100/50 rounded-full blur-3xl -z-10 pointer-events-none" />

                    <div className="space-y-1.5">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-xs font-semibold">
                            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                            Candidate Dashboard
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                            Welcome back, <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">{user?.name || 'Engineer'}</span> 👋
                        </h1>
                        <p className="text-slate-600 text-sm sm:text-base max-w-xl">
                            Track your interview performance, start targeted AI mock sessions, and sharpen your technical responses.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <Link
                            to="/interviews/new"
                            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-600/25 transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/35 active:scale-[0.98]"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Start New Interview
                        </Link>
                    </div>
                </div>

                {/* ── Active Session Alert Banner (if any) ── */}
                {activeInterview && (
                    <div className="relative rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-500 to-blue-600 p-6 text-white shadow-lg overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md text-2xl shrink-0">
                                🎙️
                            </div>
                            <div>
                                <span className="inline-block text-xs font-bold uppercase tracking-wider text-indigo-100 bg-white/20 px-2.5 py-0.5 rounded-full mb-1">
                                    {activeInterview.status === 'pending' ? 'Session Pending' : 'Interview In Progress'}
                                </span>
                                <h3 className="text-lg font-bold">
                                    You have an active {activeInterview.mode} interview waiting
                                </h3>
                                <p className="text-indigo-100 text-xs sm:text-sm">
                                    Difficulty: <span className="capitalize font-semibold text-white">{activeInterview.difficulty}</span> • {activeInterview.duration} mins duration
                                </p>
                            </div>
                        </div>
                        <Link
                            to={`/interviews/${activeInterview._id}`}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-indigo-600 shadow-md hover:bg-indigo-50 transition-all shrink-0 active:scale-[0.98]"
                        >
                            Resume Session →
                        </Link>
                    </div>
                )}

                {/* ── Stats Widget Grid ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* Stat 1 */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold text-xl">
                            📊
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Sessions</p>
                            <p className="text-2xl font-extrabold text-slate-900">{totalCount}</p>
                        </div>
                    </div>

                    {/* Stat 2 */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 font-bold text-xl">
                            🏆
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Completed Reports</p>
                            <p className="text-2xl font-extrabold text-slate-900">{completedCount}</p>
                        </div>
                    </div>

                    {/* Stat 3 */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 font-bold text-xl">
                            📄
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Resume Context</p>
                            <p className="text-sm font-bold text-slate-900 truncate max-w-[140px]">
                                {resume ? resume.fileName : 'Not Uploaded'}
                            </p>
                        </div>
                    </div>

                    {/* Stat 4 */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 font-bold text-xl">
                            ⚡
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Interview Status</p>
                            <p className="text-sm font-bold text-emerald-600 flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                Ready to Practice
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Quick Action Hub Grid ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Action 1 */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between group">
                        <div className="space-y-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-2xl text-indigo-600 group-hover:scale-110 transition-transform">
                                🎯
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Start AI Mock Interview</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Choose from Voice AI, Resume-based questions, System Design, or STAR behavioral tracks.
                            </p>
                        </div>
                        <Link
                            to="/interviews/new"
                            className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 pt-2"
                        >
                            Configure Session →
                        </Link>
                    </div>

                    {/* Action 2 */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between group">
                        <div className="space-y-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600 group-hover:scale-110 transition-transform">
                                📄
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Manage Resume Context</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Upload or update your PDF resume to let AI ask custom questions tailored to your experience.
                            </p>
                        </div>
                        <Link
                            to="/resume/upload"
                            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 pt-2"
                        >
                            {resume ? 'Manage Resume File →' : 'Upload Resume PDF →'}
                        </Link>
                    </div>

                    {/* Action 3 */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between group">
                        <div className="space-y-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-2xl text-emerald-600 group-hover:scale-110 transition-transform">
                                📈
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Session Reports & Rubrics</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Review detailed scorecards, strengths, missed technical concepts, and model answers.
                            </p>
                        </div>
                        <Link
                            to="/interviews/history"
                            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 pt-2"
                        >
                            View All History →
                        </Link>
                    </div>
                </div>

                {/* ── Recent Interviews List Section ── */}
                <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Recent Interview Sessions</h2>
                            <p className="text-xs text-slate-500">Your latest practice sessions and their status</p>
                        </div>
                        {interviews && interviews.length > 5 && (
                            <Link
                                to="/interviews/history"
                                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
                            >
                                View All ({interviews.length}) →
                            </Link>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="h-20 rounded-2xl bg-slate-200/60 animate-pulse border border-slate-200"
                                />
                            ))}
                        </div>
                    ) : error ? (
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-600">
                            <p className="text-sm font-semibold">Could not load your interview sessions.</p>
                        </div>
                    ) : recentInterviews.length === 0 ? (
                        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center space-y-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-3xl mx-auto text-indigo-600">
                                🚀
                            </div>
                            <div className="max-w-md mx-auto space-y-1">
                                <h3 className="text-lg font-bold text-slate-900">No mock interviews yet</h3>
                                <p className="text-sm text-slate-500">
                                    Start your first AI mock interview to practice speech, technical depth, and system design.
                                </p>
                            </div>
                            <Link
                                to="/interviews/new"
                                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition-all"
                            >
                                Launch First Interview
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentInterviews.map((interview) => (
                                <InterviewCard key={interview._id} interview={interview} />
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Account Settings & Danger Zone ── */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold mb-1">
                                ⚙️ Account Management
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">Profile & Security Settings</h2>
                            <p className="text-slate-500 text-xs sm:text-sm">Manage your candidate identity and account data</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        {/* Profile Info Summary */}
                        <div className="space-y-2.5 rounded-2xl bg-slate-50 p-5 border border-slate-200/80">
                            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Signed In As</div>
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-xs">
                                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div className="truncate">
                                    <p className="text-sm font-bold text-slate-900">{user?.name || 'User Profile'}</p>
                                    <p className="text-xs text-slate-500 truncate">{user?.email || 'Registered Candidate'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Danger Zone Box */}
                        <div className="rounded-2xl border border-red-200/80 bg-red-50/40 p-5 space-y-3 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
                                    <span>⚠️</span> Danger Zone
                                </div>
                                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                    Permanently delete your profile, interviews, responses, audio logs, and uploaded resumes.
                                </p>
                            </div>
                            <button
                                onClick={() => setIsDeleteModalOpen(true)}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-red-700 transition-all active:scale-[0.98] self-start"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete Account & Profile
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Standardized Footer across all pages */}
            <Footer />

            {/* Modal for Deleting Account */}
            <DeleteAccountModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
            />
        </div>
    )
}