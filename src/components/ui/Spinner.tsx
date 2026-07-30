interface SpinnerProps {
    size?: 'xs' | 'sm' | 'md' | 'lg'
    color?: 'white' | 'indigo' | 'slate' | 'emerald'
    className?: string
}

const sizeMap = {
    xs: 'h-3.5 w-3.5 border-[2px]',
    sm: 'h-4 w-4 border-2',
    md: 'h-5 w-5 border-2',
    lg: 'h-8 w-8 border-[3px]',
}

const colorMap = {
    white: 'border-white/30 border-t-white',
    indigo: 'border-indigo-200 border-t-indigo-600',
    slate: 'border-slate-200 border-t-slate-600',
    emerald: 'border-emerald-200 border-t-emerald-600',
}

export default function Spinner({ size = 'sm', color = 'white', className = '' }: SpinnerProps) {
    return (
        <span
            className={`inline-block rounded-full animate-spin ${sizeMap[size]} ${colorMap[color]} ${className}`}
            aria-label="Loading"
        />
    )
}
