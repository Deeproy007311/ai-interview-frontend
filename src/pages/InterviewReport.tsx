import { useParams, Link } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useInterview, useReport } from '@/hooks/useInterview'
import { getErrorMessage } from '@/api/client'
import Spinner from '@/components/ui/Spinner'

function ScoreCard({ label, value, color }: { label: string; value: number; color?: string }) {
    const rounded = Math.round(value)
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-xs space-y-1">
            <p className={`text-4xl font-extrabold ${color || 'text-indigo-600'}`}>{rounded}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
        </div>
    )
}

function ListSection({ title, items, icon, badgeColor }: { title: string; items: string[]; icon?: string; badgeColor?: string }) {
    if (items.length === 0) return null
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                {icon && <span>{icon}</span>}
                {title}
            </h3>
            <ul className="space-y-2">
                {items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700 leading-relaxed">
                        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${badgeColor || 'bg-indigo-100 text-indigo-700'}`}>
                            •
                        </span>
                        {item}
                    </li>
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
            <div className="min-h-screen flex flex-col bg-slate-50">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center gap-3">
                    <Spinner size="lg" color="indigo" />
                    <p className="text-slate-500 font-medium text-sm">Loading evaluation scorecard...</p>
                </div>
                <Footer />
            </div>
        )
    }

    if (interviewError || !interview) {
        return (
            <div className="min-h-screen flex flex-col bg-slate-50">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-6">
                    <p className="text-red-500 font-semibold">Could not load this interview report.</p>
                    <Link to="/dashboard" className="text-sm font-semibold text-indigo-600 underline">
                        Back to Dashboard
                    </Link>
                </div>
                <Footer />
            </div>
        )
    }

    if (interview.status === 'cancelled') {
        return (
            <div className="min-h-screen flex flex-col bg-slate-50">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-6">
                    <p className="text-slate-600">This interview was cancelled — no report was generated.</p>
                    <Link to="/dashboard" className="text-sm font-semibold text-indigo-600 underline">
                        Back to Dashboard
                    </Link>
                </div>
                <Footer />
            </div>
        )
    }

    if (interview.status === 'pending' || interview.status === 'in_progress') {
        return (
            <div className="min-h-screen flex flex-col bg-slate-50">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-6 max-w-md mx-auto">
                    <div className="text-4xl">🎙️</div>
                    <p className="text-slate-700 font-medium">
                        This interview hasn't finished yet — the AI report card will be generated once it's complete.
                    </p>
                    <Link
                        to={`/interviews/${id}`}
                        className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition-all"
                    >
                        Continue Session →
                    </Link>
                </div>
                <Footer />
            </div>
        )
    }

    if (reportLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-slate-50">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center gap-3">
                    <Spinner size="lg" color="emerald" />
                    <p className="text-slate-500 font-medium text-sm">Generating detailed scorecard...</p>
                </div>
                <Footer />
            </div>
        )
    }

    if (reportError || !report) {
        return (
            <div className="min-h-screen flex flex-col bg-slate-50">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-6">
                    <p className="text-red-500 font-semibold">{getErrorMessage(reportError)}</p>
                    <Link to="/dashboard" className="text-sm font-semibold text-indigo-600 underline">
                        Back to Dashboard
                    </Link>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none -z-10 h-full w-full" />

            <Navbar />

            <main className="flex-1 mx-auto max-w-4xl w-full px-4 sm:px-6 py-10 space-y-8">
                {/* Title Header */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm text-center space-y-2">
                    <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                        EVALUATION REPORT CARD
                    </span>
                    <h1 className="text-3xl font-extrabold text-slate-900 capitalize">
                        {interview.mode} Interview Report
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 capitalize">
                        Difficulty: <strong className="text-slate-800">{interview.difficulty}</strong> • {report.totalQuestions} Questions Evaluated
                    </p>
                </div>

                {/* Scorecards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <ScoreCard label="Overall Score" value={report.overallScore} color="text-indigo-600" />
                    <ScoreCard label="Technical" value={report.technicalScore} color="text-blue-600" />
                    <ScoreCard label="Communication" value={report.communicationScore} color="text-emerald-600" />
                    <ScoreCard label="Confidence" value={report.confidenceScore} color="text-purple-600" />
                </div>

                {/* Executive Summary */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Executive Summary
                    </h3>
                    <p className="text-slate-700 text-sm leading-relaxed">{report.summary}</p>
                </div>

                {/* Strengths & Weaknesses */}
                <div className="grid gap-6 sm:grid-cols-2">
                    <ListSection
                        title="Strengths"
                        items={report.strengths}
                        icon="💪"
                        badgeColor="bg-emerald-100 text-emerald-800"
                    />
                    <ListSection
                        title="Areas for Improvement"
                        items={report.weaknesses}
                        icon="🎯"
                        badgeColor="bg-amber-100 text-amber-800"
                    />
                </div>

                {/* Missed Concepts & Improvement Suggestions */}
                <div className="grid gap-6 sm:grid-cols-2">
                    <ListSection
                        title="Missed Technical Concepts"
                        items={report.missedConcepts}
                        icon="⚠️"
                        badgeColor="bg-red-100 text-red-800"
                    />
                    <ListSection
                        title="Actionable Feedback"
                        items={report.improvementSuggestions}
                        icon="💡"
                        badgeColor="bg-blue-100 text-blue-800"
                    />
                </div>

                {/* Learning Path */}
                {report.learningPath.length > 0 && (
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                            🚀 Recommended Next Steps & Learning Path
                        </h3>
                        <ol className="space-y-3">
                            {report.learningPath.map((step, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-bold">
                                        {i + 1}
                                    </span>
                                    <span className="pt-0.5">{step}</span>
                                </li>
                            ))}
                        </ol>
                    </div>
                )}

                <div className="flex justify-center gap-4 pt-4">
                    <Link
                        to="/interviews/history"
                        className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all"
                    >
                        ← All Reports
                    </Link>
                    <Link
                        to="/dashboard"
                        className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-700 transition-all"
                    >
                        Back to Dashboard →
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    )
}