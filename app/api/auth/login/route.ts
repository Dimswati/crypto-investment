import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getEnvValue } from "@/lib/utils";

export async function POST(req: NextRequest) {
    const { email, password } = await req.json()

    if (!email || !password) {
        return NextResponse.json({ success: false, error: "No credentials" }, { status: 400 })
    }

    // get user from db
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (!user) {
        return NextResponse.json({ success: false, error: "Invalid Credentials" }, { status: 400 })
    }

    // compare hashedPassword
    const hashedPassword = user.passwordHash
    const isUserPassword = await bcrypt.compare(password, hashedPassword)

    if (!isUserPassword) {
        return NextResponse.json({ success: false, error: "Invalid Credentials" }, { status: 400 })
    }

    // create cookie and save user session on cookie
    const cookieStore = await cookies()
    let token

    try {
        const jwtSecret = getEnvValue("JWT_SECRET_KEY") as string

        token = jwt.sign({
            userId: user.id,
            email: user.email,
            emailverified: user.emailverified
        }, jwtSecret, {
            expiresIn: "1d"
        })

    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
    }

    cookieStore.set("auth-token", token, {
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,
        httpOnly: true
    })

    return NextResponse.json({ success: true })
}