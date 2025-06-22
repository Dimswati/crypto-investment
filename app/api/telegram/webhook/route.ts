import { getEnvValue } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

const BOT_TOKEN = getEnvValue("TELEGRAM_BOT_TOKEN");
const TELEGRAM_BOT_API_URL = `https://api.telegram.org/bot<${BOT_TOKEN}>/setWebhook?url=https://crypto-investment-pi.vercel.app/api/bot`;

export async function POST(req: NextRequest) {
    const body = await req.json()
    console.log("Telegram webhook data: ", body)

    // check for incoming message and respond accordingly

    return NextResponse.json({ success: true })
}