import { useState, type ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useMyResume, useUploadResume } from '@/hooks/useResume'
import { getErrorMessage } from '@/api/client'
import Spinner from '@/components/ui/Spinner'

const MAX_SIZE_BYTES = 5 * 1024 * 1024

function validateFile(file: File): string | null {
    if (file.type !== 'application/pdf') {
        return 'Only PDF files are allowed.'
    }
    if (file.size > MAX_SIZE_BYTES) {
        return 'File must be under 5MB.'
    }
    return null
}

export default function ResumeUpload() {
    const { data: resume, isLoading } = useMyResume()
    const uploadMutation = useUploadResume()
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [fileError, setFileError] = useState<string | null>(null)

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) {
            setSelectedFile(null)
            setFileError(null)
            return
        }
        const error = validateFile(file)
        if (error) {
            setFileError(error)
            setSelectedFile(null)
        } else {
            setFileError(null)
            setSelectedFile(file)
        }
    }

    const handleUpload = () => {
        if (!selectedFile) return
        uploadMutation.mutate(selectedFile, {
            onSuccess: () => {
                toast.success('Resume uploaded successfully!')
                setSelectedFile(null)
            },
            onError: (err) => {
                toast.error(getErrorMessage(err))
            },
        })
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none -z-10 h-full w-full" />

            <Navbar />

            <main className="flex-1 mx-auto max-w-3xl w-full px-4 sm:px-6 py-12 flex flex-col items-center">
                <div className="w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl space-y-8">
                    <div className="text-center space-y-2">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 text-3xl mx-auto border border-indigo-100">
                            📄
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                            Resume Context Engine
                        </h1>
                        <p className="text-sm text-slate-600 max-w-md mx-auto">
                            Upload your PDF resume so InterviewAI can generate realistic questions customized to your past experience.
                        </p>
                    </div>

                    {/* Current Resume Status */}
                    {isLoading ? (
                        <div className="h-16 rounded-2xl bg-slate-100 animate-pulse" />
                    ) : resume ? (
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white font-bold text-lg">
                                    ✓
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                                        Active Resume on File
                                    </p>
                                    <a
                                        href={resume.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-bold text-emerald-900 hover:underline"
                                    >
                                        {resume.fileName}
                                    </a>
                                </div>
                            </div>
                            <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                                Ready
                            </span>
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 text-center">
                            <p className="text-xs font-semibold text-amber-800">No resume uploaded yet.</p>
                            <p className="text-xs text-amber-700 mt-0.5">Upload a PDF below to enable personalized AI questions.</p>
                        </div>
                    )}

                    {/* File Upload Box */}
                    <div className="space-y-4 pt-2 border-t border-slate-100">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                            Select Resume File (PDF, Max 5MB)
                        </label>
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={handleFileChange}
                            className="w-full text-sm text-slate-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all cursor-pointer"
                        />

                        {fileError && (
                            <p className="text-xs font-semibold text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
                                ⚠️ {fileError}
                            </p>
                        )}

                        {selectedFile && !fileError && (
                            <p className="text-xs font-semibold text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                                📎 Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                            </p>
                        )}

                        <button
                            onClick={handleUpload}
                            disabled={!selectedFile || uploadMutation.isPending}
                            className="w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition-all disabled:opacity-60 active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            {uploadMutation.isPending ? (
                                <>
                                    <Spinner size="sm" color="white" />
                                    <span>Uploading & Parsing...</span>
                                </>
                            ) : resume ? (
                                'Replace Existing Resume'
                            ) : (
                                'Upload Resume PDF'
                            )}
                        </button>
                    </div>

                    <div className="text-center pt-2">
                        <Link to="/dashboard" className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors">
                            ← Back to Candidate Dashboard
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}