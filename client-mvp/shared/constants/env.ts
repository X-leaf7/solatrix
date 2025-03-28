import * as dotenv from "dotenv"

dotenv.config()

export const REST_API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
export const WS_API_BASE_URL = process.env.NEXT_PUBLIC_WS_BASE_URL
export const BACKEND_HOST_URL = process.env.NEXT_PUBLIC_BACKEND_HOST_URL
