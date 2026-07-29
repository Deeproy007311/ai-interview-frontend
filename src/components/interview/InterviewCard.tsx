import { Link } from 'react-router-dom'
import type { Interview } from '@/types'
import { formatDate, interviewLinkFor, statusBadgeClasses, statusLabel } from '@/lib/interviewDisplay'

export default function InterviewCard({ interview }: { interview: Interview }) {
    return (
        <Link
            to={interviewLinkFor(interview)}
            className="flex items-center justify-between rounded border border-slate-700 bg-slate-800 p-4 transition-colors hover:border-slate-600"
        >
            <div>
                <div className="flex items-center gap-2">
                    <span className="font-medium capitalize">{interview.mode} interview</span>
                    <span
                        className={`rounded-full border px-2 py-0.5 text-xs ${statusBadgeClasses(interview.status)}`}
                    >
                        {statusLabel(interview.status)}
                    </span>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                    {interview.difficulty} · {interview.duration} min · {formatDate(interview.createdAt)}
                </p>
                {interview.skills.length > 0 && (
                    <p className="mt-1 text-xs text-slate-500">{interview.skills.join(', ')}</p>
                )}
            </div>
            <span className="text-slate-500">→</span>
        </Link>
    )
}