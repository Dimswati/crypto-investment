import { NextRequest, NextResponse } from "next/server";
import jwt, { TokenExpiredError } from "jsonwebtoken"
import { getEnvValue } from "@/lib/utils";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {

    let data;

    try {
        data = await req.json()
    } catch(error) {
        console.log("No data value")
    }

    // GET PASSED TOKEN
    let authToken = data?.token || (await cookies()).get("auth-token")

    authToken = typeof authToken === "string" ? authToken : authToken?.value

    if(!authToken || authToken === "") {
        return NextResponse.json({ status: "Error", message: "No token provided" }, { status: 400 })
    }

    try {
        const jwtSecret = getEnvValue("JWT_SECRET_KEY") as string;
        const payload = jwt.verify(authToken, jwtSecret)
        return NextResponse.json({ valid: true, payload })
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            return NextResponse.json({ valid: false, error: "Token Expired" }, { status: 401 })
        }

        return NextResponse.json({ valid: false, error: "Invalid Token" }, { status: 401 })
    }
}