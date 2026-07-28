import { apiClient } from '@/api/client'
import type { ResumeUploadResponse, ResumeMeResponse } from '@/types'

export async function uploadResume(file: File): Promise<ResumeUploadResponse> {
    const formData = new FormData()
    formData.append('resume', file)

    const res = await apiClient.post<ResumeUploadResponse>('/api/resumes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
}

export async function getMyResume(): Promise<ResumeMeResponse> {
    const res = await apiClient.get<ResumeMeResponse>('/api/resumes/me')
    return res.data
}