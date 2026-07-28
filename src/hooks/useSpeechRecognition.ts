import { useCallback, useEffect, useRef, useState } from 'react'

interface UseSpeechRecognitionOptions {
    onResult: (finalTranscriptChunk: string) => void
    onError?: (message: string) => void
}

interface UseSpeechRecognitionReturn {
    isSupported: boolean
    isListening: boolean
    start: () => void
    stop: () => void
}

// SpeechRecognition has no official TS lib types and is Chrome/Edge-only
// today (no Firefox, partial Safari) — hence the `any` casts and the
// `isSupported` flag the UI uses to disable the mic button gracefully.
export function useSpeechRecognition({
    onResult,
    onError,
}: UseSpeechRecognitionOptions): UseSpeechRecognitionReturn {
    const SpeechRecognitionCtor =
        typeof window !== 'undefined'
            ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
            : null
    const isSupported = !!SpeechRecognitionCtor

    const [isListening, setIsListening] = useState(false)
    const recognitionRef = useRef<any>(null)
    const onResultRef = useRef(onResult)
    const onErrorRef = useRef(onError)

    useEffect(() => {
        onResultRef.current = onResult
    }, [onResult])

    useEffect(() => {
        onErrorRef.current = onError
    }, [onError])

    useEffect(() => {
        if (!isSupported || !SpeechRecognitionCtor) return

        const recognition = new SpeechRecognitionCtor()
        recognition.continuous = true
        recognition.interimResults = false
        recognition.lang = 'en-US'

        recognition.onresult = (event: any) => {
            let finalChunk = ''
            for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    finalChunk += event.results[i][0].transcript
                }
            }
            if (finalChunk.trim()) {
                onResultRef.current(finalChunk.trim())
            }
        }

        recognition.onerror = (event: any) => {
            setIsListening(false)
            if (event.error !== 'no-speech' && event.error !== 'aborted') {
                onErrorRef.current?.(`Voice input error: ${event.error}`)
            }
        }

        recognition.onend = () => {
            setIsListening(false)
        }

        recognitionRef.current = recognition

        return () => {
            recognition.onresult = null
            recognition.onerror = null
            recognition.onend = null
            recognition.stop()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSupported])

    const start = useCallback(() => {
        if (!isSupported || !recognitionRef.current) return
        try {
            recognitionRef.current.start()
            setIsListening(true)
        } catch {
            // start() throws if recognition is already active — safe to ignore
        }
    }, [isSupported])

    const stop = useCallback(() => {
        if (!isSupported || !recognitionRef.current) return
        recognitionRef.current.stop()
        setIsListening(false)
    }, [isSupported])

    return { isSupported, isListening, start, stop }
}