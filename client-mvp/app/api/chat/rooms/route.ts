import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

import { REST_API_BASE_URL } from "@/shared/constants"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Get token from cookies
    const cookieStore = await cookies()
    const token = cookieStore.get("access_token")?.value

    if (!token) {
      return NextResponse.json({ detail: "Authentication required" }, { status: 401 })
    }

    // Forward the request to your backend
    const response = await fetch(`${REST_API_BASE_URL}/api/chatroom/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        name: body.name,
        is_private: true,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ detail: data.detail || "Failed to create chat room" }, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error creating chat room:", error)
    return NextResponse.json({ detail: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    const cookieStore = await cookies()
    const token = cookieStore.get("access_token")?.value

    if (!token) {
      return NextResponse.json({ detail: "Authentication required" }, { status: 401 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    // Build query string
    let queryString = ""
    if (type) {
      queryString = `?type=${type}`
    }

    // Forward the request to your backend
    const response = await fetch(`${REST_API_BASE_URL}/api/chatrooms/${queryString}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ detail: data.detail || "Failed to fetch chat rooms" }, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching chat rooms:", error)
    return NextResponse.json({ detail: "An unexpected error occurred" }, { status: 500 })
  }
}

