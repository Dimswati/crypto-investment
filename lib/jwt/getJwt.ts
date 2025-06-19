import jwt from "jsonwebtoken"
import { getEnvValue } from "../utils"

export function getJwt({ payload }: { payload: object }){
    const jwtSecret = getEnvValue("JWT_SECRET_KEY")
}