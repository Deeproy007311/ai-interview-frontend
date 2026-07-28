import { useState, type ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useMyResume, useUploadResume } from '@/hooks/useResume'
import { getErrorMessage } from '@/api/client'

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
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-900 p-6 text-white">
            <h1 className="text-3xl font-bold">Resume Upload</h1>

            {isLoading ? (
                <p className="text-slate-400">Checking for existing resume...</p>
            ) : resume ? (
                <div className="w-full max-w-md rounded border border-slate-700 bg-slate-800 p-4">
                    <p className="text-sm text-slate-400">Current resume:</p>
                    <a
                        href={resume.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 underline"
                    >
                        {resume.fileName}
                    </a>
                </div>
            ) : (
                <p className="text-slate-400">No resume uploaded yet.</p>
            )}

            <div className="w-full max-w-md space-y-3">
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="w-full text-sm text-slate-300"
                />
                {fileError && <p className="text-sm text-red-400">{fileError}</p>}
                {selectedFile && !fileError && (
                    <p className="text-sm text-slate-400">Selected: {selectedFile.name}</p>
                )}

                <button
                    onClick={handleUpload}
                    disabled={!selectedFile || uploadMutation.isPending}
                    className="w-full rounded bg-blue-600 py-2 font-medium disabled:opacity-50"
                >
                    {uploadMutation.isPending ? 'Uploading...' : resume ? 'Replace resume' : 'Upload resume'}
                </button>
            </div>

            <Link to="/dashboard" className="text-sm text-slate-400 underline">
                Back to Dashboard
            </Link>
        </div>
    )
}