import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
    createInterview,
    listInterviews,
    getInterview,
    startInterview,
    submitAnswer,
    generateReport,
    deleteInterview,
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

export function useDeleteInterview() {
    const resetSession = useInterviewStore((s) => s.reset)
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => deleteInterview(id),
        onSuccess: (_res, id) => {
            resetSession()
            queryClient.removeQueries({ queryKey: ['interviews', id] })
            queryClient.invalidateQueries({ queryKey: ['interviews'] })
        },
    })
}

// The report endpoint is a POST, but the backend guarantees it's
// idempotent — repeat calls just return the same saved report rather than
// regenerating it. That makes it safe to treat as a plain "fetch" here via
// useQuery, which gives this page normal loading/error/caching behavior
// instead of needing to manually trigger + track a mutation on mount.
// `enabled` is driven by the caller so this never fires before the
// interview is confirmed `completed`.
export function useReport(id: string | undefined, enabled: boolean) {
    return useQuery({
        queryKey: ['interviews', id, 'report'],
        queryFn: async () => (await generateReport(id!)).data,
        enabled: !!id && enabled,
    })
}