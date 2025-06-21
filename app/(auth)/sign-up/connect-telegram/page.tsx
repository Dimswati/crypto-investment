"use client"

declare global {
  interface Window {
    onTelegramAuth: (user: any) => void;
  }
}

import { useSignupFlowContext } from "@/app/context/SignupFlowContext"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Link } from "lucide-react"
import { useEffect, useState } from "react"

const ConnectTelegram = () => {

  // const [isMounted, setIsMouted] = useState(false)
  const { setStep } = useSignupFlowContext()

  useEffect(() => {
    setStep("connect-telegram")
  }, [])

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?7';
    script.setAttribute('data-telegram-login', 'FundedTradeBot');
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-userpic', 'false');
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.async = true;

    window.onTelegramAuth = function (user: any) {
      console.log(user)
      fetch('/api/telegram/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      }).then(() => {
        window.location.href = '/dashboard';
      });
    };

    document.getElementById('telegram-login-btn')?.appendChild(script);
  })

  return (
    <div>
      <h2 className='text-center text-2xl font-bold mb-2'>Connect Telegram</h2>
      <p className='text-center text-base mb-6'>All Communications on funding trade requests will go here</p>
      <div className="flex items-center justify-center">
        <a className={cn(buttonVariants())} id="telegram-login-btn">connect telegram</a>
      </div>
    </div>
  )
}

export default ConnectTelegram