import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto"
import { getEnvValue } from "@/lib/utils";

const BOT_TOKEN = getEnvValue("TELEGRAM_BOT_TOKEN") as string

function validateTelegram(data: any): boolean {
  const { hash, ...checkData } = data;
  const secret = crypto.createHash('sha256').update(BOT_TOKEN).digest();
  const checkString = Object.keys(checkData)
    .sort()
    .map(k => `${k}=${checkData[k]}`)
    .join('\n');

  const hmac = crypto.createHmac('sha256', secret).update(checkString).digest('hex');
  return hmac === hash;
}

// Callback url that telegram will call
export async function POST(req: NextRequest) {

    const data = await req.json()

    if(!validateTelegram(data)) {
        return NextResponse.json({ error: "Invalid Telegram login" }, { status: 401 })
    }

    // validate another account does not exist with same username
    console.log(data)
    
    // Update user info to database, and update jwt token

    return NextResponse.json({  })

}