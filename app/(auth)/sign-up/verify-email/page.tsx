'use client'

import React, { useEffect, useState } from 'react'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem } from '@/components/ui/form'
import { useSignupFlowContext } from '@/app/context/SignupFlowContext'
import axios, { AxiosError } from 'axios'
import { useRouter, useSearchParams } from 'next/navigation'
import { Form } from '@/components/ui/form'
import z from "zod"
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
  email: z.string().email({ message: "Invalid Email Address" })
})

const VerifyEmailPage = () => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const { setStep } = useSignupFlowContext()
  // const codeSent = searchParams.get("codeSent") // since i send code from client side, I dont need this params

  const [email, setEmail] = useState(() => {
    const email = searchParams.get("email")
    return email ? email : null
  })

  const [otp, setOtp] = useState('')
  const [sendingCode, setSendingCode] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  
  const [isUpdating, setIsUpdating] = useState(false)
  const [mailChange, setMailChange] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: email ? email : undefined
    }
  })

  // Set current step
  useEffect(() => {
    setStep("verify-email")
  }, [setStep])

  // Send code if it hasn't been sent
  useEffect(() => {
    if (isUpdating) return
    sendEmailCode()
  }, [isUpdating, email])

  // Verify OTP when it's fully entered
  useEffect(() => {
    if (otp.length < 6) return
    verifyEmailCode()
  }, [otp])

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => setCooldown((prev) => prev - 1), 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  const sendEmailCode = async () => {
    if (!email || isUpdating) return
    console.log("Sending code to:", email)
    setSendingCode(true)
    setCooldown(60) // 60 second cooldown
    try {
      await axios.post("/api/auth/send-code", { email })
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error sending code:", error.message)
      }
    } finally {
      setSendingCode(false)
    }
  }

  const verifyEmailCode = async () => {
    if (!otp || !email) return
    setIsVerifying(true)
    try {
      await axios.post("/api/auth/verify-code", { email, code: otp })
      router.replace('/sign-up/connect-telegram') // redirect on success
    } catch (error) {
      console.error("Error verifying code:", error)
    } finally {
      setIsVerifying(false)
    }
  }

  const resendCode = async () => {
    if (cooldown > 0 || sendingCode) return
    await sendEmailCode()
  }

  const onSubmit = async (formData: z.infer<typeof formSchema>) => {
    if (!email) return
    if (email === formData.email) {
      form.setError("email", { type: "value", message: "Update your email first" })
      return
    }
    setIsSubmitting(true)
    try {
      // update email on server and return the new email
      const res = await axios.put("/api/auth/update-email", {
        currentEmail: email,
        newEmail: formData.email
      })

      if (res.status === 200) {
        router.replace(`/sign-up/verify-email?email=${formData.email}`)
        setIsUpdating(false)
        setEmail(formData.email)
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          form.setError("email", { type: "value", message: "This email is already in use." })
        }

        form.setError("email", { type: "value", message: "Failed to update email." })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <h2 className='text-center text-2xl font-bold mb-3'>{isUpdating ? "Update" : "Verify"} Email</h2>
      {!isUpdating ? (
        <>
          <p className='text-center text-base mb-6'>Enter the code sent to {Boolean(email) && (<span className='font-bold underline'>{email}</span>)}
          </p>
          <div className='flex flex-col items-center justify-center gap-y-4'>
            <InputOTP maxLength={6} value={otp} onChange={setOtp} disabled={isVerifying}>
              <InputOTPGroup>
                {[...Array(6)].map((_, i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>

            <div className='flex gap-x-4'>
              <Button
                disabled={sendingCode || isVerifying || cooldown > 0}
                onClick={resendCode}
              >
                {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
              </Button>
              {cooldown < 1 && <Button variant={"outline"} onClick={() => setIsUpdating(true)}>update email</Button>}
            </div>
          </div>
        </>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='max-w-md px-4 mx-auto flex flex-col gap-y-4'>
            <FormField name='email' control={form.control} render={({ field, formState }) => (
              <FormItem>
                <FormControl>
                  <Input type='email' placeholder='johndoe@gmail.com' {...field} />
                </FormControl>
                {formState.errors.email ? <span className='text-sm text-red-600'>{formState.errors.email.message}</span> : null}
              </FormItem>
            )} />
            <div className='w-full flex gap-x-4'>
              <Button type='button' variant={"outline"} onClick={() => setIsUpdating(false)}>back</Button>
              <Button type='submit' disabled={isSubmitting}>update email</Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}

export default VerifyEmailPage
