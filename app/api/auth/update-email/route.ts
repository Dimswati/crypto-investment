import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { getEnvValue } from "@/lib/utils";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken"

export async function PUT(req: NextRequest) {

    const { currentEmail, newEmail } = await req.json()

    if (!currentEmail || !newEmail) {
        return NextResponse.json({ success: false, error: "Bad request" }, { status: 409 })
    }

    try {
        // update the user and update auth token
        const updatedUser = await prisma.user.update({
            where: {
                email: currentEmail
            },
            data: {
                email: newEmail
            }
        })

        // setCookie
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

        return NextResponse.json({ success: true, user: updatedUser.email });

    } catch (error) {

        if (error instanceof PrismaClientKnownRequestError &&
            error.code === 'P2002') {
            return NextResponse.json({ success: false, error: "Email already in use by another account" }, { status: 400 })
        }

        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 })
    }

}