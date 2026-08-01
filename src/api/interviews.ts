import { apiClient } from '@/api/client'
import type {
    CreateInterviewResponse,
    ListInterviewsResponse,
    GetInterviewResponse,
    StartInterviewResponse,
    AnswerResponse,
    ReportResponse,
    InterviewMode,
    Difficulty,
    ExperienceLevel,
} from '@/types'

export interface CreateInterviewPayload {
    mode: InterviewMode
    skills?: string[]
    difficulty: Difficulty
    duration: number
    resume?: string
    experienceLevel?: ExperienceLevel
}

export interface AnswerPayload {
    questionId: string
    transcript: string
    /** Signal to the backend that the session timer has expired. */
    isTimedOut?: boolean
}

export async function createInterview(
    payload: CreateInterviewPayload,
): Promise<CreateInterviewResponse> {
    const res = await apiClient.post<CreateInterviewResponse>('/api/interviews', payload)
    return res.data
}

export async function listInterviews(): Promise<ListInterviewsResponse> {
    const res = await apiClient.get<ListInterviewsResponse>('/api/interviews')
    return res.data
}

export async function getInterview(id: string): Promise<GetInterviewResponse> {
    const res = await apiClient.get<GetInterviewResponse>(`/api/interviews/${id}`)
    return res.data
}

export async function startInterview(id: string): Promise<StartInterviewResponse> {
    const res = await apiClient.post<StartInterviewResponse>(`/api/interviews/${id}/start`)
    return res.data
}

export async function submitAnswer(
    id: string,
    payload: AnswerPayload,
): Promise<AnswerResponse> {
    const res = await apiClient.post<AnswerResponse>(`/api/interviews/${id}/answer`, payload)
    return res.data
}

export async function generateReport(id: string): Promise<ReportResponse> {
    const res = await apiClient.post<ReportResponse>(`/api/interviews/${id}/report`)
    return res.data
}

export async function deleteInterview(id: string): Promise<{ success: boolean; message: string }> {
    const res = await apiClient.delete<{ success: boolean; message: string }>(`/api/interviews/${id}`)
    return res.data
}