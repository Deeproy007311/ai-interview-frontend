import React from 'react'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string
}

export function Skeleton({ className = '', ...props }: SkeletonProps) {
    return (
        <div
            className={`animate-pulse rounded-xl bg-slate-200/80 ${className}`}
            {...props}
        />
    )
}

export function ActiveSessionSkeleton() {
    return (
        <div className="relative rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="h-12 w-12 rounded-xl bg-slate-200/90 shrink-0" />
                <div className="space-y-2 w-full sm:w-80">
                    <div className="h-4 w-32 rounded-full bg-slate-200/90" />
                    <div className="h-5 w-3/4 rounded-lg bg-slate-200/90" />
                    <div className="h-3.5 w-1/2 rounded-md bg-slate-200/90" />
                </div>
            </div>
            <div className="h-11 w-full sm:w-36 rounded-xl bg-slate-200/90 shrink-0" />
        </div>
    )
}
