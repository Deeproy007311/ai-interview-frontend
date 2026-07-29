import { Link } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import InterviewCard from '@/components/interview/InterviewCard'
import { useInterviews } from '@/hooks/useInterview'

export default function InterviewHistory() {
    const { data: interviews, isLoading, error } = useInterviews()

    const completedInterviews = interviews?.filter((i) => i.status === 'completed') ?? []

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
            {/* Background Mesh */}
            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none -z-10 h-full w-full" />

            <Navbar />

            <main className="flex-1 mx-auto max-w-5xl w-full px-4 sm:px-6 py-10 space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900">Interview History</h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Review all completed mock interviews and evaluation report scorecards.
                        </p>
                    </div>
                    <Link
                        to="/interviews/new"
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-all self-start sm:self-auto"
                    >
                        + New Interview
                    </Link>
                </div>

                {isLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-20 rounded-2xl bg-slate-200/60 animate-pulse border border-slate-200" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-600">
                        <p className="text-sm font-semibold">Could not load your interview history.</p>
                    </div>
                ) : completedInterviews.length === 0 ? (
                    <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center space-y-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-3xl mx-auto text-indigo-600">
                            📋
                        </div>
                        <div className="max-w-md mx-auto space-y-1">
                            <h3 className="text-lg font-bold text-slate-900">No completed interviews yet</h3>
                            <p className="text-sm text-slate-500">
                                Complete your first mock interview to unlock detailed AI evaluation scorecards.
                            </p>
                        </div>
                        <Link
                            to="/interviews/new"
                            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition-all"
                        >
                            Start an Interview
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {completedInterviews.map((interview) => (
                            <InterviewCard key={interview._id} interview={interview} />
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    )
}