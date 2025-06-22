"use client"

declare global {
  interface Window {
    onTelegramAuth?: (user: any) => void;
  }
}

import { useSignupFlowContext } from "@/app/context/SignupFlowContext"
import { useEffect } from "react"

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
    script.setAttribute('data-size', 'medium');
    script.setAttribute('data-userpic', 'false');
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.setAttribute('data-radius', '5')
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

    return () => {

      // Clean up to prevent memory leaks
      delete window.onTelegramAuth
      const container = document.getElementById("telegram-login-btn")
      if(container) {
        container.innerHTML = ""
      }
    }
  })

  return (
    <div>
      <h2 className='text-center text-2xl font-bold mb-2'>Connect Telegram</h2>
      <p className='text-center text-base mb-6'>All Communications on funding trade requests will go here</p>
      <div className="flex items-center justify-center">
        <div id="telegram-login-btn"></div>
      </div>
    </div>
  )
}

export default ConnectTelegram