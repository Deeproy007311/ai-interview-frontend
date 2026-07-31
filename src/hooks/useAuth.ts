import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { registerUser, loginUser, getMe, deleteUserProfile, type RegisterPayload, type LoginPayload } from '@/api/auth'
import { useAuthStore } from '@/store/authStore'
import { useInterviewStore } from '@/store/interviewStore'
import { getErrorMessage } from '@/api/client'

export function useRegister() {
    const setToken = useAuthStore((s) => s.setToken)

    return useMutation({
        mutationFn: (payload: RegisterPayload) => registerUser(payload),
        onSuccess: (data) => {
            toast.success('Account created successfully!')
            setToken(data.accessToken)
        },
        onError: (err) => {
            toast.error(getErrorMessage(err))
        },
    })
}

export function useLogin() {
    const setToken = useAuthStore((s) => s.setToken)

    return useMutation({
        mutationFn: (payload: LoginPayload) => loginUser(payload),
        onSuccess: (data) => {
            toast.success('Welcome back!')
            setToken(data.accessToken)
        },
        onError: (err) => {
            toast.error(getErrorMessage(err))
        },
    })
}

export function useMe() {
    const token = useAuthStore((s) => s.token)
    const setUser = useAuthStore((s) => s.setUser)

    return useQuery({
        queryKey: ['me'],
        queryFn: async () => {
            const res = await getMe()
            setUser(res.user)
            return res.user
        },
        enabled: !!token,
    })
}

export function useDeleteProfile() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const logout = useAuthStore((s) => s.logout)
    const resetSession = useInterviewStore((s) => s.reset)

    return useMutation({
        mutationFn: () => deleteUserProfile(),
        onSuccess: (data) => {
            resetSession()
            logout()
            queryClient.clear()
            toast.success(data.message || 'Account deleted successfully')
            navigate('/')
        },
        onError: (err) => {
            toast.error(getErrorMessage(err))
        },
    })
}