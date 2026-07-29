import { Link } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import InterviewCard from '@/components/interview/InterviewCard'
import { useInterviews } from '@/hooks/useInterview'
import { useMe } from '@/hooks/useAuth'

export default function Dashboard() {
    const { data: user } = useMe()
    const { data: interviews, isLoading, error } = useInterviews()

    const activeInterview = interviews?.find(
        (i) => i.status === 'pending' || i.status === 'in_progress',
    )
    const recentInterviews = interviews?.slice(0, 5) ?? []

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            <Navbar />

            <div className="mx-auto max-w-4xl space-y-8 px-6 py-8">
                <div>
                    <h1 className="text-2xl font-bold">{user ? `Welcome back, ${user.name}` : 'Welcome back'}</h1>
                    <p className="mt-1 text-sm text-slate-400">Here's what's happening with your interview prep.</p>
                </div>

                {activeInterview && (
                    <div className="rounded border border-blue-800 bg-blue-950 p-4">
                        <p className="text-sm text-blue-300">
                            You have an interview {activeInterview.status === 'pending' ? 'waiting to start' : 'in progress'}.
                        </p>
                        <Link
                            to={`/interviews/${activeInterview._id}`}
                            className="mt-2 inline-block rounded bg-blue-600 px-4 py-2 text-sm font-medium"
                        >
                            Resume interview
                        </Link>
                    </div>
                )}

                <div className="flex flex-wrap gap-3">
                    <Link to="/interviews/new" className="rounded bg-blue-600 px-4 py-2 text-sm font-medium">
                        Start new interview
                    </Link>
                    <Link
                        to="/resume/upload"
                        className="rounded border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300"
                    >
                        Manage resume
                    </Link>
                </div>

                <div>
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Recent interviews</h2>
                        {interviews && interviews.length > 5 && (
                            <Link to="/interviews/history" className="text-sm text-slate-400 underline">
                                View all
                            </Link>
                        )}
                    </div>

                    {isLoading ? (
                        <p className="text-sm text-slate-400">Loading interviews...</p>
                    ) : error ? (
                        <p className="text-sm text-red-400">Could not load your interviews.</p>
                    ) : recentInterviews.length === 0 ? (
                        <p className="text-sm text-slate-400">
                            You haven't taken any interviews yet. Start one above to get going.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {recentInterviews.map((interview) => (
                                <InterviewCard key={interview._id} interview={interview} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}