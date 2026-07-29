import { useCallback, useEffect, useRef, useState } from 'react'

interface UseSpeechRecognitionOptions {
    onResult: (transcript: string) => void
    onError?: (message: string) => void
}

interface UseSpeechRecognitionReturn {
    isSupported: boolean
    isListening: boolean
    start: (initialText?: string) => void
    stop: () => void
}

function describeError(errorCode: string): string {
    switch (errorCode) {
        case 'network':
            return 'Voice input lost its connection. Check your internet connection or try again.'
        case 'not-allowed':
        case 'service-not-allowed':
            return 'Microphone access is blocked. Check your browser\'s site permissions and try again.'
        case 'audio-capture':
            return 'No microphone was found. Check your device and try again.'
        default:
            return `Voice input stopped (${errorCode}). You can try again or type your answer.`
    }
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
    const shouldListenRef = useRef(false)
    const retryCountRef = useRef(0)
    const restartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const initialTextRef = useRef('')
    const sessionFinalTextRef = useRef('')

    const onResultRef = useRef(onResult)
    const onErrorRef = useRef(onError)

    useEffect(() => {
        onResultRef.current = onResult
    }, [onResult])

    useEffect(() => {
        onErrorRef.current = onError
    }, [onError])

    const clearRestartTimeout = useCallback(() => {
        if (restartTimeoutRef.current) {
            clearTimeout(restartTimeoutRef.current)
            restartTimeoutRef.current = null
        }
    }, [])

    const cleanupRecognition = useCallback((keepListeners = false) => {
        if (recognitionRef.current) {
            try {
                if (!keepListeners) {
                    recognitionRef.current.onresult = null
                    recognitionRef.current.onerror = null
                    recognitionRef.current.onend = null
                }
                recognitionRef.current.stop()
            } catch {
                // Ignore stop errors if already stopped
            }
            if (!keepListeners) {
                recognitionRef.current = null
            }
        }
    }, [])

    const startListening = useCallback(() => {
        if (!isSupported || !SpeechRecognitionCtor) return

        cleanupRecognition(false)

        try {
            const recognition = new SpeechRecognitionCtor()
            recognition.continuous = true
            recognition.interimResults = true
            recognition.lang = 'en-US'

            recognition.onresult = (event: any) => {
                retryCountRef.current = 0
                let currentFinal = ''
                let currentInterim = ''

                for (let i = 0; i < event.results.length; i++) {
                    const res = event.results[i]
                    if (res.isFinal) {
                        currentFinal += res[0].transcript + ' '
                    } else {
                        currentInterim += res[0].transcript
                    }
                }

                sessionFinalTextRef.current = currentFinal.trim()
                const spoken = (sessionFinalTextRef.current + (currentInterim ? ' ' + currentInterim : '')).trim()
                const base = initialTextRef.current.trim()

                const fullText = base ? (spoken ? `${base} ${spoken}` : base) : spoken
                if (fullText) {
                    onResultRef.current(fullText)
                }
            }

            recognition.onerror = (event: any) => {
                const error = event.error
                const isFatalError =
                    error === 'not-allowed' ||
                    error === 'service-not-allowed' ||
                    error === 'audio-capture'

                if (isFatalError) {
                    shouldListenRef.current = false
                    setIsListening(false)
                    onErrorRef.current?.(describeError(error))
                    return
                }

                if (shouldListenRef.current) {
                    if (typeof navigator !== 'undefined' && !navigator.onLine) {
                        shouldListenRef.current = false
                        setIsListening(false)
                        onErrorRef.current?.('You appear to be offline. Check your internet connection.')
                        return
                    }

                    retryCountRef.current += 1
                    if (retryCountRef.current > 6) {
                        shouldListenRef.current = false
                        setIsListening(false)
                        onErrorRef.current?.(describeError(error))
                        return
                    }

                    // Transient error (like browser speech socket disconnect/network hiccup) — try reconnecting silently
                    clearRestartTimeout()
                    restartTimeoutRef.current = setTimeout(() => {
                        if (shouldListenRef.current) {
                            if (sessionFinalTextRef.current) {
                                const base = initialTextRef.current.trim()
                                initialTextRef.current = base
                                    ? `${base} ${sessionFinalTextRef.current}`
                                    : sessionFinalTextRef.current
                                sessionFinalTextRef.current = ''
                            }
                            startListening()
                        }
                    }, 500)
                } else {
                    setIsListening(false)
                }
            }

            recognition.onend = () => {
                if (shouldListenRef.current) {
                    clearRestartTimeout()
                    restartTimeoutRef.current = setTimeout(() => {
                        if (shouldListenRef.current) {
                            if (sessionFinalTextRef.current) {
                                const base = initialTextRef.current.trim()
                                initialTextRef.current = base
                                    ? `${base} ${sessionFinalTextRef.current}`
                                    : sessionFinalTextRef.current
                                sessionFinalTextRef.current = ''
                            }
                            startListening()
                        }
                    }, 250)
                } else {
                    setIsListening(false)
                }
            }

            recognitionRef.current = recognition
            recognition.start()
            setIsListening(true)
        } catch {
            if (shouldListenRef.current) {
                clearRestartTimeout()
                restartTimeoutRef.current = setTimeout(() => {
                    if (shouldListenRef.current) {
                        startListening()
                    }
                }, 500)
            } else {
                setIsListening(false)
            }
        }
    }, [isSupported, SpeechRecognitionCtor, cleanupRecognition, clearRestartTimeout])

    const start = useCallback((initialText?: string) => {
        if (!isSupported) return
        shouldListenRef.current = true
        retryCountRef.current = 0
        initialTextRef.current = initialText || ''
        sessionFinalTextRef.current = ''
        clearRestartTimeout()
        startListening()
    }, [isSupported, clearRestartTimeout, startListening])

    const stop = useCallback(() => {
        shouldListenRef.current = false
        retryCountRef.current = 0
        clearRestartTimeout()
        cleanupRecognition(true)
        setIsListening(false)
    }, [clearRestartTimeout, cleanupRecognition])

    useEffect(() => {
        return () => {
            shouldListenRef.current = false
            clearRestartTimeout()
            cleanupRecognition(false)
        }
    }, [clearRestartTimeout, cleanupRecognition])

    return { isSupported, isListening, start, stop }
}