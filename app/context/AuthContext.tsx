"use client"

import axios, { AxiosError } from "axios";
import { createContext, useState, useContext, useEffect } from "react";

type User = {
    email?: string,
    userId?: string
}

type AuthUser = {
    user?: User;
    setUser: (userId: string, email: string) => void;
    logOut: () => void;
}

const AuthContext = createContext<AuthUser | undefined>(undefined)

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {

    const [userState, setUserState] = useState<User | undefined>(undefined)

    useEffect(() => {
        const getAuthenticatedUser = async () => {
            try {
                const res = await axios.post("/api/auth/verify-token")
                const user = res.data.payload
                setUserState({
                    email: user.email,
                    userId: user.userId
                })
            } catch (err) {
                if (err instanceof AxiosError) {
                    console.log(err.response?.data)
                }
            }
        }

        getAuthenticatedUser()
    }, [])

    const setUser = (userId: string, email: string) => {
        setUserState({
            userId,
            email
        })
    }

    const logOut = () => {

    }

    return (
        <AuthContext.Provider value={{ user: userState, setUser, logOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => {
    const ctx = useContext(AuthContext)

    if (ctx === undefined) {
        throw new Error("useAuth must be used within a UserContextProvider")
    }

    return ctx
}