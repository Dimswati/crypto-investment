import crypto from "crypto"

export function hashCode(code: string): string {
    if (!code) throw new Error("Code is required for hashing")
    return crypto.createHash("sha256").update(code).digest("hex")
}