// ── User ──────────────────────────────────────────
export interface User {
    _id: string
    name: string
    email: string
    createdAt: string
    updatedAt: string
}

// ── Resume ────────────────────────────────────────
export interface Resume {
    _id: string
    owner: string
    fileName: string
    fileUrl: string
    extractedText: string
    createdAt: string
    updatedAt: string
}

// ── Interview enums ───────────────────────────────
export type InterviewMode = 'resume' | 'skills' | 'mixed' | 'hr'
export type Difficulty = 'beginner' | 'intermediate' | 'advanced'
export type InterviewStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'
export type ExperienceLevel = 'fresher' | 'experienced'
export type QuestionSection =
    | 'introduction'
    | 'resume'
    | 'technical'
    | 'behavioral'
    | 'hr'
    | 'closing'

export interface InterviewPlanSection {
    name: string
    questions: number
}

export interface InterviewPlan {
    estimatedDuration: number
    sections: InterviewPlanSection[]
}

export interface Interview {
    _id: string
    owner: string
    mode: InterviewMode
    skills: string[]
    difficulty: Difficulty
    duration: number
    status: InterviewStatus
    resume: string | null
    experienceLevel: ExperienceLevel | null
    interviewPlan: InterviewPlan | null
    welcomeMessage: string | null
    startedAt: string | null
    endedAt: string | null
    createdAt: string
    updatedAt: string
}

export interface Question {
    id: string
    order: number
    questionNumber: number
    section: QuestionSection
    question: string
}

export interface StartInterviewData {
    welcomeMessage: string
    interviewPlan: InterviewPlan
    firstQuestion: Question
    totalQuestions: number
}

export interface AnswerResponseData {
    interviewComplete: boolean
    transitionMessage: string | null
    nextQuestion: Question | null
    totalQuestions: number
}

// ── Feedback report ───────────────────────────────
export interface FeedbackReport {
    _id: string
    interview: string
    owner: string
    overallScore: number
    technicalScore: number
    communicationScore: number
    confidenceScore: number
    totalQuestions: number
    summary: string
    strengths: string[]
    weaknesses: string[]
    missedConcepts: string[]
    improvementSuggestions: string[]
    learningPath: string[]
    createdAt: string
    updatedAt: string
}

// ── API response shapes (per endpoint) ────────────
// Auth endpoints return { accessToken } with no `success` wrapper
export interface AuthResponse {
    accessToken: string
}

export interface MeResponse {
    success: true
    user: User
}

export interface DeleteProfileResponse {
    success: true
    message: string
}

export interface ResumeUploadResponse {
    success: true
    message: string
    resume: Resume
}

export interface ResumeMeResponse {
    success: true
    resume: Resume
}

export interface CreateInterviewResponse {
    success: true
    message: string
    data: Interview
}

export interface ListInterviewsResponse {
    success: true
    data: Interview[]
}

export interface GetInterviewResponse {
    success: true
    data: Interview
}

export interface StartInterviewResponse {
    success: true
    message: string
    data: StartInterviewData
}

export interface AnswerResponse {
    success: true
    message: string
    data: AnswerResponseData
}

export interface ReportResponse {
    success: true
    data: FeedbackReport
}

export interface ApiErrorResponse {
    success: false
    message: string
}