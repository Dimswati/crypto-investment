"use client"

import { useSignupFlowContext } from '@/app/context/SignupFlowContext'
import { twMerge } from 'tailwind-merge'
import React from 'react'

const StepTabs = () => {

    const ctx = useSignupFlowContext()
    console.log("Number tab steps", ctx.step)

    return (
        <div className="my-6 lg:w-[30vw] md:w-[40vw] sm:w-[60vw] w-[70vw] mx-auto flex justify-between items-center relative before:absolute before:bg-neutral-200 before:h-0.5 before:inset-x-0 before:w-full">
            <div className={twMerge("w-10 h-10 bg-white border-2 border-neutral-200 rounded-full flex items-center justify-center font-bold z-20", ctx.step === "sign-up" && "bg-neutral-200")}>1</div>
            <div className={twMerge("w-10 h-10 bg-white border-2 border-neutral-200 rounded-full flex items-center justify-center font-bold z-20", ctx.step === "verify-email" && "bg-neutral-200")}>2</div>
            <div className={twMerge("w-10 h-10 bg-white border-2 border-neutral-200 rounded-full flex items-center justify-center font-bold z-20", ctx.step === "connect-telegram" && "bg-neutral-200")}>3</div>
        </div>
    )
}

export default StepTabs