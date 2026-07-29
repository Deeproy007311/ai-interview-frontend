import type { Interview, InterviewStatus } from '@/types'

export function formatDate(dateString: string): string {
    return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(dateString))
}

export function statusLabel(status: InterviewStatus): string {
    switch (status) {
        case 'pending':
            return 'Pending'
        case 'in_progress':
            return 'In progress'
        case 'completed':
            return 'Completed'
        case 'cancelled':
            return 'Cancelled'
    }
}

export function statusBadgeClasses(status: InterviewStatus): string {
    switch (status) {
        case 'pending':
            return 'bg-yellow-950 text-yellow-300 border-yellow-800'
        case 'in_progress':
            return 'bg-blue-950 text-blue-300 border-blue-800'
        case 'completed':
            return 'bg-green-950 text-green-300 border-green-800'
        case 'cancelled':
            return 'bg-slate-800 text-slate-400 border-slate-700'
    }
}

// Completed interviews go straight to their report; every other status
// (pending, in_progress, cancelled) goes to the session page, which
// already knows how to render the right state for each of those.
export function interviewLinkFor(interview: Interview): string {
    if (interview.status === 'completed') {
        return `/interviews/${interview._id}/report`
    }
    return `/interviews/${interview._id}`
}