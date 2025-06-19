import { useState, useEffect } from "react"

export const useLocalStorage = <T>(key: string) => {
    const [storedValue, setStoredValue] = useState<T | undefined>(() => {

        if(typeof window === "undefined") return

        try {
            const value = window.localStorage.getItem(key)
            return value ? (JSON.parse(value) as T) : undefined
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return undefined
        }
    })

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue))
        } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error)
        }
    }, [key, storedValue])

    return [storedValue, setStoredValue] as const

}