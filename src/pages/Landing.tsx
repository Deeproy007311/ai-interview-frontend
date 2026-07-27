import { Link } from 'react-router-dom'

export default function Landing() {
    return (
        <div className="flex h-screen flex-col items-center justify-center gap-4 bg-slate-900 text-white">
            <h1 className="text-4xl font-bold">Landing Page</h1>
            <div className="flex gap-4">
                <Link to="/login" className="underline">Login</Link>
                <Link to="/register" className="underline">Register</Link>
                <Link to="/dashboard" className="underline">Dashboard</Link>
            </div>
        </div>
    )
}