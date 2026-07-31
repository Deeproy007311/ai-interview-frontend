import { useCallback, useEffect, useRef, useState } from 'react'
import { transcribeAudio } from '@/api/transcription'
import { getErrorMessage } from '@/api/client'

interface UseAudioRecorderOptions {
    onTranscribed: (text: string) => void
    onError?: (message: string) => void
}

interface UseAudioRecorderReturn {
    isSupported: boolean
    isRecording: boolean
    isTranscribing: boolean
    start: () => void
    stop: () => void
}

// MediaRecorder + Groq's Whisper endpoint both accept webm/ogg/mp4 directly
// — no client-side re-encoding needed regardless of which the browser picks.
function pickMimeType(): string | undefined {
    const candidates = ['audio/webm', 'audio/ogg', 'audio/mp4']
    for (const type of candidates) {
        if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)) {
            return type
        }
    }
    return undefined
}

// Unlike the old SpeechRecognition-based mic (Chrome/Edge only),
// MediaRecorder + getUserMedia have broad support across Chrome, Edge,
// Firefox, and Safari — this hook works in meaningfully more browsers.
export function useAudioRecorder({
    onTranscribed,
    onError,
}: UseAudioRecorderOptions): UseAudioRecorderReturn {
    const isSupported =
        typeof navigator !== 'undefined' &&
        !!navigator.mediaDevices?.getUserMedia &&
        typeof MediaRecorder !== 'undefined'

    const [isRecording, setIsRecording] = useState(false)
    const [isTranscribing, setIsTranscribing] = useState(false)

    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const chunksRef = useRef<Blob[]>([])
    const streamRef = useRef<MediaStream | null>(null)
    const onTranscribedRef = useRef(onTranscribed)
    const onErrorRef = useRef(onError)

    useEffect(() => {
        onTranscribedRef.current = onTranscribed
        onErrorRef.current = onError
    }, [onTranscribed, onError])

    const cleanupStream = useCallback(() => {
        streamRef.current?.getTracks().forEach((track) => track.stop())
        streamRef.current = null
    }, [])

    const start = useCallback(async () => {
        if (!isSupported || mediaRecorderRef.current) return

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            streamRef.current = stream

            const mimeType = pickMimeType()
            const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
            chunksRef.current = []

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) chunksRef.current.push(event.data)
            }

            recorder.onstop = async () => {
                cleanupStream()
                mediaRecorderRef.current = null
                setIsRecording(false)

                const blob = new Blob(chunksRef.current, { type: mimeType || 'audio/webm' })
                chunksRef.current = []

                if (blob.size === 0) return

                setIsTranscribing(true)
                try {
                    const result = await transcribeAudio(blob)
                    onTranscribedRef.current(result.text)
                } catch (err) {
                    onErrorRef.current?.(getErrorMessage(err))
                } finally {
                    setIsTranscribing(false)
                }
            }

            mediaRecorderRef.current = recorder
            recorder.start()
            setIsRecording(true)
        } catch {
            onErrorRef.current?.('Microphone access was denied or is unavailable.')
        }
    }, [isSupported, cleanupStream])

    const stop = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop()
        }
    }, [])

    return { isSupported, isRecording, isTranscribing, start, stop }
}