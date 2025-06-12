import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

import { REST_API_BASE_URL } from "@/shared/constants"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Forward the login request to your backend
    const response = await fetch(`${REST_API_BASE_URL}/api/otp_login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    // If login successful, set HTTP-only cookies
    if (response.ok && data.auth_token) {
      // Get the cookie store - use await since cookies() returns a Promise
      const cookieStore = await cookies()

      // Set cookies with HTTP-only flag
      cookieStore.set({
        name: "split_access_token",
        value: data.auth_token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        // Set expiration as needed
        maxAge: 60 * 60 * 24 * 7, // 1 week
      })

      // Set user data in a regular cookie (not HTTP-only)
      cookieStore.set({
        name: "user",
        value: JSON.stringify(data.user),
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      })
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}

