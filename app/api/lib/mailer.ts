import { getEnvValue } from "@/lib/utils"
import { Resend } from "resend"
import VerifyEmailTemplate from "./EmailTemplates/VerifyEmailTemplate"

const resend = new Resend(getEnvValue("RESEND_API_KEY"))

interface VerificationDetails {
    email: string,
    code: string
}

export async function sendVerificationCode({ email, code }: VerificationDetails) {

    const { data, error } = await resend.emails.send({
        from: "verify@polstore.co.ke",
        to: [email],
        subject: "Your Verification Code",
        react: VerifyEmailTemplate({ code }) as React.ReactElement
    })

    console.log(error, "Error occured while sending emmail")

    if (error) {
        throw new Error("Failed sending code", { cause: error })
    }

    return data
}
