"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem } from "../../../components/ui/form"
import Link from "next/link"
import z from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import axios, { AxiosError } from "axios"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid Email Address"
  }),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message: "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number"
  })
})

type SignInFormData = z.infer<typeof formSchema>

const SignIn = () => {
  const [isSubmittting, setIsSubmitting] = useState(false)

  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  })

  const onSubmit = async (data: SignInFormData) => {
    try {
      setIsSubmitting(true)
      await axios.post("/api/auth/login", {
        ...data
      })
      router.replace('/')
    } catch (error) {
      if(error instanceof AxiosError) {
        console.log(error.response?.data.error)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mt-8">
      <h2 className='text-center text-2xl font-bold mb-2'>Sign In</h2>
      <p className='text-center text-base mb-6'>Need an account? <Link href={"/sign-up"} className="text-blue-500">sign up</Link></p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md px-4 mx-auto flex flex-col gap-y-4">
          <FormField name="email" control={form.control} render={({ field, formState }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="johndoe@gmail.com" />
              </FormControl>
              {formState.errors.email ? <span className="text-sm text-red-600">{formState.errors.email.message}</span> : null}
            </FormItem>
          )} />
          <FormField name="password" control={form.control} render={({ field, formState }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="********" type="password" />
              </FormControl>
              {formState.errors.password ? <span className="text-sm text-red-600">{formState.errors.password.message}</span> : null}
            </FormItem>
          )} />
          <Button disabled={isSubmittting} className='w-full' type='submit'>sign in</Button>
        </form>
      </Form>
    </div>
  )
}

export default SignIn