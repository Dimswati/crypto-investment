import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashCode } from "@/lib/hash";
import jwt from "jsonwebtoken"
import { getEnvValue } from "@/lib/utils";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
    const { email, code }: { email: string, code: string } = await req.json()

    if (!email || !code) {
        return NextResponse.json({ success: false, error: "Invalid Credentials" }, { status: 400 })
    }

    const savedCode = await prisma.emailVerificationCode.findUnique({
        where: {
            email
        }
    })

    if (!savedCode) {
        return NextResponse.json({ success: false, error: "No code found" }, { status: 400 })
    }

    if (new Date(savedCode.expiresAt) < new Date()) {
        return NextResponse.json({ success: false, error: "Code expired" }, { status: 400 });
    }

    if (savedCode.used) {
        return NextResponse.json({ success: false, error: "Code already used" }, { status: 400 });
    }

    const inputCodeHash = hashCode(code)
    if (inputCodeHash !== savedCode.codeHash) {
        return NextResponse.json({ success: false, error: "Invalid code" }, { status: 400 });
    }

    await prisma.emailVerificationCode.update({
        where: {
            email
        },
        data: {
            used: true
        }
    })

    // update our cookie auth-token with email_verified == true
    const updatedUser = await prisma.user.update({
        where: {
            email
        },
        data: {
            emailverified: true
        }
    })

    const cookieStore = await cookies()
    const token = jwt.sign({
        userId: updatedUser.id,
        email: updatedUser.email,
        emailverified: updatedUser.emailverified
    }, getEnvValue("JWT_SECRET_KEY") as string, {
        expiresIn: "1d"
    })

    cookieStore.set("auth-token", token, {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 86400000
    })

    return NextResponse.json({ success: true })
    // if(savedCode.codeHash !== hashCode(code))
}