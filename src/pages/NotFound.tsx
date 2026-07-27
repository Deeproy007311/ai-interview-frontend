import { Link } from 'react-router-dom'

export default function NotFound() {
    return (
        <div className="flex h-screen flex-col items-center justify-center gap-4 bg-slate-900 text-white">
            <h1 className="text-4xl font-bold">404 — Page Not Found</h1>
            <Link to="/" className="underline">Go home</Link>
        </div>
    )
}