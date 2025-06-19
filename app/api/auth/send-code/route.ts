import { hashCode } from "@/lib/hash";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendVerificationCode } from "../../lib/mailer";

export async function POST(req: NextRequest) {

    // Check if there is existing code with the same email in database
    // If there is existing code, check if it is used 
    // if is is used: true, (we have verified and set cookies => emailVerfied:true)
    // if it is used false, but expiresAt > Date.now(), create a new hashedCode and update the code on our database, send code the code to email and return necessary response
    // if it is used false, but expiresAt < Date.now(), send the code to email and return necessary response

    const { email }: { email: string } = await req.json()
    //check is existing code for that email

    const savedCode = await prisma.emailVerificationCode.findUnique({
        where: {
            email
        }
    })

    if (!savedCode || new Date(savedCode.expiresAt) < new Date(Date.now())) {
        console.log("Generating code to send to database")

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedCode = hashCode(code)
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

        try {
            console.log("Intialize sending code")
            await sendVerificationCode({
                email,
                code
            })

            // send code to database
            await prisma.emailVerificationCode.upsert({
                where: {
                    email
                },
                update: {
                    email,
                    codeHash: hashedCode,
                    expiresAt,
                    used: false
                },
                create: {
                    email,
                    codeHash: hashedCode,
                    expiresAt
                }
            })
            // redirect user to verify email page
            return NextResponse.json({ success: true })

        } catch (error) {
            return NextResponse.json({ success: false, error: "Could not send verification email" }, { status: 500 })
        }

    }

    return NextResponse.json({ success: false, message: "Code already sent" }, { status: 500 })

}