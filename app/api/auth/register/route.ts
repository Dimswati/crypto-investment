import { NextRequest, NextResponse } from "next/server";
import { FormData } from "@/app/(auth)/sign-up/page";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { getEnvValue } from "@/lib/utils";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
    // TODO: 1. Check if we have an existing user in the database
    // TODO: 2. Verify user`s email (EXTRA: only allow emails from specified providers)
    // TODO: 3. Create a new user in the database
    const { email, password }: Pick<FormData, "email" | "password"> = await req.json()

    // TODO: 1. Verify user email
    // TODO: 2. Create a new user in database after verification
    // Check if we have an existing user in database
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (user) {
        // create a user in our data
        return NextResponse.json({ success: false, error: "User already exists" }, { status: 500 })
    }

    const hashedPassword = await bcrypt.hash(password, 8)

    const createdUser = await prisma.user.create({
        data: {
            email,
            passwordHash: hashedPassword
        }
    })

    const token = jwt.sign({
        userId: createdUser.id,
        email: createdUser.email,
        emailverified: createdUser.emailverified
    }, getEnvValue("JWT_SECRET_KEY") as string, {
        expiresIn: "1d"
    })

    const cookieStore = await cookies()

    cookieStore.set("auth-token", token, {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 86400000
    })

    return NextResponse.json({ success: true, user: createdUser.email })
}