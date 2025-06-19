import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken"
import { getEnvValue } from "@/lib/utils";

export async function POST(req: NextRequest) {

    const { token }: { token: string } = await req.json()
    // console.log("jwtToken", token)

    try {
        const jwtSecret = getEnvValue("JWT_SECRET_KEY") as string;
        const payload = jwt.verify(token, jwtSecret)
        return NextResponse.json({ valid: true, payload })
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            return NextResponse.json({ valid: false, error: "Token Expired" }, { status: 401 })
        }

        return NextResponse.json({ valid: false, error: "Invalid Token" }, { status: 401 })
    }
}