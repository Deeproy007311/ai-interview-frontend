import { useParams, Link } from 'react-router-dom'
import { useInterview, useReport } from '@/hooks/useInterview'
import { getErrorMessage } from '@/api/client'

function ScoreCard({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded border border-slate-700 bg-slate-800 p-4 text-center">
            <p className="text-3xl font-bold">{Math.round(value)}</p>
            <p className="mt-1 text-xs text-slate-400">{label}</p>
        </div>
    )
}

function ListSection({ title, items }: { title: string; items: string[] }) {
    if (items.length === 0) return null
    return (
        <div>
            <h3 className="mb-2 text-sm font-semibold text-slate-300">{title}</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-300">
                {items.map((item, i) => (
                    <li key={i}>{item}</li>
                ))}
            </ul>
        </div>
    )
}

export default function InterviewReport() {
    const { id } = useParams<{ id: string }>()
    const { data: interview, isLoading: interviewLoading, error: interviewError } = useInterview(id)

    const isCompleted = interview?.status === 'completed'
    const {
        data: report,
        isLoading: reportLoading,
        error: reportError,
    } = useReport(id, isCompleted)

    if (interviewLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
                <p className="text-slate-400">Loading...</p>
            </div>
        )
    }

    if (interviewError || !interview) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-900 text-white">
                <p className="text-red-400">Could not load this interview.</p>
                <Link to="/dashboard" className="text-sm text-slate-400 underline">
                    Back to Dashboard
                </Link>
            </div>
        )
    }

    if (interview.status === 'cancelled') {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-900 text-white">
                <p className="text-slate-300">This interview was cancelled — no report was generated.</p>
                <Link to="/dashboard" className="text-sm text-slate-400 underline">
                    Back to Dashboard
                </Link>
            </div>
        )
    }

    if (interview.status === 'pending' || interview.status === 'in_progress') {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-900 p-6 text-center text-white">
                <p className="text-slate-300">
                    This interview hasn't finished yet — the report will be available once it's complete.
                </p>
                <Link
                    to={`/interviews/${id}`}
                    className="rounded bg-blue-600 px-4 py-2 font-medium"
                >
                    Continue interview
                </Link>
                <Link to="/dashboard" className="text-sm text-slate-400 underline">
                    Back to Dashboard
                </Link>
            </div>
        )
    }

    if (reportLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
                <p className="text-slate-400">Loading your report...</p>
            </div>
        )
    }

    if (reportError || !report) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-900 text-white">
                <p className="text-red-400">{getErrorMessage(reportError)}</p>
                <Link to="/dashboard" className="text-sm text-slate-400 underline">
                    Back to Dashboard
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-900 px-6 py-10 text-white">
            <div className="mx-auto max-w-3xl space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">Interview Report</h1>
                    <p className="mt-1 text-sm capitalize text-slate-400">
                        {interview.mode} interview — {interview.difficulty} — {report.totalQuestions} questions
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <ScoreCard label="Overall" value={report.overallScore} />
                    <ScoreCard label="Technical" value={report.technicalScore} />
                    <ScoreCard label="Communication" value={report.communicationScore} />
                    <ScoreCard label="Confidence" value={report.confidenceScore} />
                </div>

                <div>
                    <h3 className="mb-2 text-sm font-semibold text-slate-300">Summary</h3>
                    <p className="text-sm leading-relaxed text-slate-300">{report.summary}</p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                    <ListSection title="Strengths" items={report.strengths} />
                    <ListSection title="Weaknesses" items={report.weaknesses} />
                </div>

                <ListSection title="Missed concepts" items={report.missedConcepts} />
                <ListSection title="Improvement suggestions" items={report.improvementSuggestions} />

                {report.learningPath.length > 0 && (
                    <div>
                        <h3 className="mb-2 text-sm font-semibold text-slate-300">Learning path</h3>
                        <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-300">
                            {report.learningPath.map((step, i) => (
                                <li key={i}>{step}</li>
                            ))}
                        </ol>
                    </div>
                )}

                <div className="flex justify-center gap-4 pt-4">
                    <Link to="/interviews/history" className="text-sm text-slate-400 underline">
                        View all reports
                    </Link>
                    <Link to="/dashboard" className="text-sm text-slate-400 underline">
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    )
}