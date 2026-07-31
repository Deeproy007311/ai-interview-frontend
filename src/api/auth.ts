import { apiClient } from '@/api/client'
import type { AuthResponse, MeResponse, DeleteProfileResponse } from '@/types'

export interface RegisterPayload {
    name: string
    email: string
    password: string
}

export interface LoginPayload {
    email: string
    password: string
}

export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>('/api/users/register', payload)
    return res.data
}

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>('/api/users/login', payload)
    return res.data
}

export async function getMe(): Promise<MeResponse> {
    const res = await apiClient.get<MeResponse>('/api/users/me')
    return res.data
}

export async function deleteUserProfile(): Promise<DeleteProfileResponse> {
    const res = await apiClient.delete<DeleteProfileResponse>('/api/users/me')
    return res.data
}