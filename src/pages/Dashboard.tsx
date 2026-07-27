import { Link } from 'react-router-dom'

export default function Dashboard() {
    return (
        <div className="flex h-screen flex-col items-center justify-center gap-4 bg-slate-900 text-white">
            <h1 className="text-4xl font-bold">Dashboard</h1>
            <div className="flex gap-4">
                <Link to="/resume/upload" className="underline">Upload Resume</Link>
                <Link to="/interviews/new" className="underline">New Interview</Link>
                <Link to="/interviews/history" className="underline">History</Link>
            </div>
        </div>
    )
}