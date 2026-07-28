import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Question, InterviewPlan, StartInterviewData, AnswerResponseData } from '@/types'

type SessionPhase = 'idle' | 'active' | 'transitioning' | 'complete'

interface InterviewSessionState {
    interviewId: string | null
    phase: SessionPhase
    welcomeMessage: string | null
    interviewPlan: InterviewPlan | null
    currentQuestion: Question | null
    pendingQuestion: Question | null
    transitionMessage: string | null
    totalQuestions: number

    startSession: (interviewId: string, data: StartInterviewData) => void
    receiveAnswerResult: (data: AnswerResponseData) => void
    revealNextQuestion: () => void
    reset: () => void
}

const initialState = {
    interviewId: null,
    phase: 'idle' as SessionPhase,
    welcomeMessage: null,
    interviewPlan: null,
    currentQuestion: null,
    pendingQuestion: null,
    transitionMessage: null,
    totalQuestions: 0,
}

// Persisted deliberately: the backend has no endpoint to fetch "the current
// question of an in-progress interview," so this store is the only source
// of truth for resuming after a refresh. The session page is responsible
// for verifying `interviewId` against the real interview status before
// trusting any of this — see InterviewSession.tsx.
export const useInterviewStore = create<InterviewSessionState>()(
    persist(
        (set) => ({
            ...initialState,

            startSession: (interviewId, data) =>
                set({
                    interviewId,
                    phase: 'active',
                    welcomeMessage: data.welcomeMessage,
                    interviewPlan: data.interviewPlan,
                    currentQuestion: data.firstQuestion,
                    pendingQuestion: null,
                    transitionMessage: null,
                    totalQuestions: data.totalQuestions,
                }),

            receiveAnswerResult: (data) =>
                set({
                    phase: data.interviewComplete ? 'complete' : 'transitioning',
                    currentQuestion: null,
                    pendingQuestion: data.interviewComplete ? null : data.nextQuestion,
                    transitionMessage: data.interviewComplete ? null : data.transitionMessage,
                    totalQuestions: data.totalQuestions,
                }),

            revealNextQuestion: () =>
                set((state) => ({
                    currentQuestion: state.pendingQuestion,
                    pendingQuestion: null,
                    transitionMessage: null,
                    phase: 'active',
                })),

            reset: () => set(initialState),
        }),
        {
            name: 'interview-session-storage',
        },
    ),
)