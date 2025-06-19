import { createContext, useState, useContext, useEffect } from "react";
import { useLocalStorage } from "../hook/useLocalStorage";

type Tab = "sign-up" | "verify-email" | "connect-telegram"

type SignUpFlowData = {
    step?: Tab,
    setStep: (step: Tab) => void;
}

const SignUpFlowContext = createContext<SignUpFlowData | undefined>(undefined)

export const SignUpFlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mounted, setIsMounted] = useState(false)
    const [step, setStep] = useLocalStorage<Tab>("step")

    useEffect(() => {
        if (!mounted) {
            setIsMounted(true)
        }
    }, [mounted])

    if (!mounted) {
        return
    }
    // console.log("context user: ", user)
    // console.log("context step: ", step)

    // get the current tab we are in from the local storage
    // set the current tab we are in to the local storage 
    return (
        <SignUpFlowContext.Provider value={{
            step,
            setStep,
        }}>
            {children}
        </SignUpFlowContext.Provider>
    )
}

export const useSignupFlowContext = () => {
    const ctx = useContext(SignUpFlowContext)
    if (!ctx) throw new Error("useSignupFlow must be used within SignupFlowProvider")
    return ctx
}