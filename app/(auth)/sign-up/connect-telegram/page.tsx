"use client"

import { useSignupFlowContext } from "@/app/context/SignupFlowContext"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Link } from "lucide-react"
import { useEffect } from "react"

const ConnectTelegram = () => {

  const { setStep } = useSignupFlowContext()

  useEffect(() => {
    setStep("connect-telegram")
  }, [])
  
  return (
    <div>
      <h2 className='text-center text-2xl font-bold mb-2'>Connect Telegram</h2>
      <p className='text-center text-base mb-6'>All Communications on funding trade requests will go here</p>
      <div className="flex items-center justify-center">
        <a href="" className={cn(buttonVariants())}>connect telegram</a>
      </div>
    </div>
  )
}

export default ConnectTelegram