import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { uploadResume, getMyResume } from '@/api/resumes'

export function useMyResume() {
    return useQuery({
        queryKey: ['resume', 'me'],
        queryFn: async () => {
            try {
                const res = await getMyResume()
                return res.resume
            } catch (err) {
                // A 404 here just means "no resume uploaded yet" — not a real error.
                // Treat it as a normal, valid "no resume" state instead of throwing.
                if (axios.isAxiosError(err) && err.response?.status === 404) {
                    return null
                }
                throw err
            }
        },
    })
}

export function useUploadResume() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (file: File) => uploadResume(file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['resume', 'me'] })
        },
    })
}