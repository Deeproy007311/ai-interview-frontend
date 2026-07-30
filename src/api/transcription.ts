import { apiClient } from '@/api/client'

export interface TranscribeAudioResponse {
    success: true
    text: string
}

export async function transcribeAudio(blob: Blob): Promise<TranscribeAudioResponse> {
    const formData = new FormData()
    const filename = blob.type.includes('ogg')
        ? 'recording.ogg'
        : blob.type.includes('mp4')
            ? 'recording.mp4'
            : 'recording.webm'

    formData.append('audio', blob, filename)

    const res = await apiClient.post<TranscribeAudioResponse>('/api/transcription', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
}