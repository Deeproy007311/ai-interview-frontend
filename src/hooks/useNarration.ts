import { useCallback, useEffect, useRef, useState } from 'react'

// ~130 words/minute reading pace, clamped so short lines don't flash by
// and long ones don't stall forever when voice is off/unsupported.
function estimateReadingMs(text: string): number {
    const words = text.trim().split(/\s+/).filter(Boolean).length
    const msPerWord = 60000 / 130
    return Math.min(Math.max(words * msPerWord, 1800), 7000)
}

interface UseNarrationReturn {
    isNarrating: boolean
    isVoiceSupported: boolean
    narrate: (text: string | null, onDone: () => void) => void
    skip: () => void
}

export function useNarration(voiceEnabled: boolean): UseNarrationReturn {
    const isVoiceSupported = typeof window !== 'undefined' && 'speechSynthesis' in window
    const [isNarrating, setIsNarrating] = useState(false)
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const onDoneRef = useRef<(() => void) | null>(null)

    const clearPending = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
        }
        if (isVoiceSupported) {
            window.speechSynthesis.cancel()
        }
    }, [isVoiceSupported])

    const narrate = useCallback(
        (text: string | null, onDone: () => void) => {
            clearPending()

            if (!text) {
                onDone()
                return
            }

            onDoneRef.current = onDone

            const finish = () => {
                setIsNarrating(false)
                const done = onDoneRef.current
                onDoneRef.current = null
                done?.()
            }

            if (voiceEnabled && isVoiceSupported) {
                const utterance = new SpeechSynthesisUtterance(text)
                utterance.rate = 0.95
                utterance.pitch = 1
                utterance.onstart = () => setIsNarrating(true)
                utterance.onend = finish
                utterance.onerror = finish
                window.speechSynthesis.speak(utterance)
            } else {
                setIsNarrating(true)
                timeoutRef.current = setTimeout(finish, estimateReadingMs(text))
            }
        },
        [voiceEnabled, isVoiceSupported, clearPending],
    )

    const skip = useCallback(() => {
        clearPending()
        setIsNarrating(false)
        const done = onDoneRef.current
        onDoneRef.current = null
        done?.()
    }, [clearPending])

    useEffect(() => {
        return () => clearPending()
    }, [clearPending])

    return { isNarrating, isVoiceSupported, narrate, skip }
}