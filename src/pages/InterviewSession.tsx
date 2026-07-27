import { useParams } from 'react-router-dom'

export default function InterviewSession() {
    const { id } = useParams()
    return (
        <div className="flex h-screen items-center justify-center bg-slate-900 text-white">
            <h1 className="text-4xl font-bold">Interview Session — {id}</h1>
        </div>
    )
}