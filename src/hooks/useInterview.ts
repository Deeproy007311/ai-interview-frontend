import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
    createInterview,
    listInterviews,
    getInterview,
    startInterview,
    submitAnswer,
    generateReport,
    type CreateInterviewPayload,
    type AnswerPayload,
} from '@/api/interviews'
import { useInterviewStore } from '@/store/interviewStore'

export function useInterviews() {
    return useQuery({
        queryKey: ['interviews'],
        queryFn: async () => (await listInterviews()).data,
    })
}

export function useInterview(id: string | undefined) {
    return useQuery({
        queryKey: ['interviews', id],
        queryFn: async () => (await getInterview(id!)).data,
        enabled: !!id,
    })
}

export function useCreateInterview() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload: CreateInterviewPayload) => createInterview(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['interviews'] })
        },
    })
}

export function useStartInterview() {
    const startSession = useInterviewStore((s) => s.startSession)
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (interviewId: string) => startInterview(interviewId),
        onSuccess: (res, interviewId) => {
            startSession(interviewId, res.data)
            queryClient.invalidateQueries({ queryKey: ['interviews', interviewId] })
            queryClient.invalidateQueries({ queryKey: ['interviews'] })
        },
    })
}

export function useSubmitAnswer() {
    const receiveAnswerResult = useInterviewStore((s) => s.receiveAnswerResult)
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: AnswerPayload }) =>
            submitAnswer(id, payload),
        onSuccess: (res, variables) => {
            receiveAnswerResult(res.data)
            if (res.data.interviewComplete) {
                queryClient.invalidateQueries({ queryKey: ['interviews', variables.id] })
                queryClient.invalidateQueries({ queryKey: ['interviews'] })
            }
        },
    })
}

export function useGenerateReport() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => generateReport(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['interviews'] })
        },
    })
}