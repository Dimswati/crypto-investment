"use client"

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from 'next/navigation'

// Components
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { useSignupFlowContext } from '@/app/context/SignupFlowContext'

const formSchema = z.object({
    email: z.string()
        .email({ message: "Invalid Email Address" }),
    password: z.string()
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
            {
                message: "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number"
            }),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match"
})

export type FormData = z.infer<typeof formSchema>

const SignUp = () => {
    // TABS: sign-up/verify-email/verify-phone
    const router = useRouter()
    const { setStep } = useSignupFlowContext()
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        setStep("sign-up")
        console.log("set step run")
    }, [])

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: ""
        }
    })

    form.watch("password")

    const onSubmit = async (data: FormData) => {
        // TODO: 1. Send data to database
        setIsSubmitting(true)
        try {
            const res = await axios.post("/api/auth/register", data)
            // console.log("Created user ", res.data)
            const params = new URLSearchParams({
                email: res.data.user,
                codeSent: "false"
            }).toString();

            router.replace(`/sign-up/verify-email?${params}`);
        } catch (err) {
            console.error(err)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div>
            <h2 className='text-center text-2xl font-bold mb-2'>Sign Up</h2>
            <p className='text-center text-base mb-6'>Already having an account? <Link href={"/sign-in"} className='text-blue-500'>login</Link></p>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='max-w-md px-4 mx-auto flex flex-col gap-y-4'>
                    <FormField name='email' control={form.control} render={({ field, formState }) => (
                        <FormItem>
                            <FormControl>
                                <Input {...field} type='email' placeholder='johndoe@gmail.com' />
                            </FormControl>
                            {formState.errors.email ? <span className='text-sm text-red-600'>{formState.errors.email.message}</span> : null}
                        </FormItem>
                    )
                    } />
                    <FormField name='password' control={form.control} render={({ field, formState }) => (
                        <FormItem>
                            <FormControl>
                                <Input {...field} type='password' placeholder='********' />
                            </FormControl>
                            {formState.errors.password ? <span className='text-sm text-red-600'>{formState.errors.password.message}</span> : null}
                        </FormItem>
                    )} />
                    <FormField name='confirmPassword' control={form.control} render={({ field, formState }) => (
                        <FormItem>
                            <FormControl>
                                <Input {...field} type='password' placeholder='********' />
                            </FormControl>
                            {formState.errors.confirmPassword ? <span className='text-sm text-red-600'>{formState.errors.confirmPassword.message}</span> : null}
                        </FormItem>
                    )} />

                    <Button disabled={isSubmitting} className='w-full' type='submit'>sign up</Button>
                </form>
            </Form>
        </div>
    )
}

export default SignUp