"use client"

declare global {
  interface Window {
    onTelegramAuth?: (user: any) => void;
  }
}

import { useSignupFlowContext } from "@/app/context/SignupFlowContext"
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect } from "react"

const ConnectTelegram = () => {

  // const [isMounted, setIsMouted] = useState(false)
  const { setStep } = useSignupFlowContext()
  const telegramBot = "FundedTradeBot"

  useEffect(() => {
    setStep("connect-telegram")
  }, [])

  return (
    <div>
      <h2 className='text-center text-2xl font-bold mb-2'>Connect Telegram</h2>
      <p className='text-center text-base mb-6'>Start our telegram bot from your telegram account </p>
      <div className="flex items-center justify-center">
        <a id="telegram-login-btn" href={`https://t.me/${telegramBot}`} className={cn(buttonVariants())}>connect telegram</a>
      </div>
    </div>
  )
}

//  useEffect(() => {

//     const script = document.createElement('script');
//     script.src = 'https://telegram.org/js/telegram-widget.js?7';
//     script.setAttribute('data-telegram-login', 'FundedTradeBot');
//     script.setAttribute('data-size', 'medium');
//     script.setAttribute('data-userpic', 'false');
//     script.setAttribute('data-request-access', 'write');
//     script.setAttribute('data-onauth', 'onTelegramAuth(user)');
//     script.setAttribute('data-radius', '5')
//     script.async = true;

//     window.onTelegramAuth = function (user: any) {
//       console.log(user)
//       fetch('/api/telegram/auth', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(user),
//       }).then(() => {
//         window.location.href = '/dashboard';
//       });
//     };
//     document.getElementById('telegram-login-btn')?.appendChild(script);

//     return () => {

//       // Clean up to prevent memory leaks
//       delete window.onTelegramAuth
//       const container = document.getElementById("telegram-login-btn")
//       if(container) {
//         container.innerHTML = ""
//       }
//     }
//   })

export default ConnectTelegram