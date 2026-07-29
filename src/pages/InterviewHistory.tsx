import { Link } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import InterviewCard from '@/components/interview/InterviewCard'
import { useInterviews } from '@/hooks/useInterview'

export default function InterviewHistory() {
    const { data: interviews, isLoading, error } = useInterviews()

    const completedInterviews = interviews?.filter((i) => i.status === 'completed') ?? []

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            <Navbar />

            <div className="mx-auto max-w-4xl space-y-6 px-6 py-8">
                <div>
                    <h1 className="text-2xl font-bold">Interview history</h1>
                    <p className="mt-1 text-sm text-slate-400">Completed interviews and their reports.</p>
                </div>

                {isLoading ? (
                    <p className="text-sm text-slate-400">Loading interviews...</p>
                ) : error ? (
                    <p className="text-sm text-red-400">Could not load your interviews.</p>
                ) : completedInterviews.length === 0 ? (
                    <div className="rounded border border-slate-700 bg-slate-800 p-6 text-center">
                        <p className="text-sm text-slate-400">You don't have any completed interviews yet.</p>
                        <Link
                            to="/interviews/new"
                            className="mt-3 inline-block rounded bg-blue-600 px-4 py-2 text-sm font-medium"
                        >
                            Start an interview
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {completedInterviews.map((interview) => (
                            <InterviewCard key={interview._id} interview={interview} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}