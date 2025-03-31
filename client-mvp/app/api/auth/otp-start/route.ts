import { type NextRequest, NextResponse } from "next/server"

import { REST_API_BASE_URL } from "@/shared/constants"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Forward the request to your backend
    const response = await fetch(`${REST_API_BASE_URL}/api/otp_start/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("OTP start error:", error)
    return NextResponse.json({ error: "OTP start failed" }, { status: 500 })
  }
}

