import { Link } from 'react-router-dom'
import type { Interview } from '@/types'
import { formatDate, interviewLinkFor } from '@/lib/interviewDisplay'

function getModeIcon(mode: string) {
    switch (mode) {
        case 'resume':
            return '📄'
        case 'skills':
            return '⚡'
        case 'hr':
            return '🤝'
        case 'mixed':
            return '🎯'
        default:
            return '🎙️'
    }
}

function getStatusBadge(status: string) {
    switch (status) {
        case 'completed':
            return (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Completed
                </span>
            )
        case 'in_progress':
            return (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    In Progress
                </span>
            )
        case 'pending':
            return (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Pending
                </span>
            )
        default:
            return (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    Cancelled
                </span>
            )
    }
}

export default function InterviewCard({ interview }: { interview: Interview }) {
    return (
        <Link
            to={interviewLinkFor(interview)}
            className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-200"
        >
            <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-xl border border-indigo-100 group-hover:scale-105 transition-transform">
                    {getModeIcon(interview.mode)}
                </div>
                <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-slate-900 capitalize text-base">
                            {interview.mode} Interview
                        </h3>
                        {getStatusBadge(interview.status)}
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                        <span className="capitalize">{interview.difficulty}</span> difficulty • {interview.duration} mins • {formatDate(interview.createdAt)}
                    </p>
                    {interview.skills && interview.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            {interview.skills.map((skill, idx) => (
                                <span
                                    key={idx}
                                    className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/80"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <span className="text-xs font-semibold text-indigo-600 group-hover:text-indigo-700 transition-colors">
                    {interview.status === 'completed' ? 'View Report' : 'Open Interview'}
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </div>
            </div>
        </Link>
    )
}