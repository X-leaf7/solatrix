import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

import { REST_API_BASE_URL } from "@/shared/constants"

export async function GET() {
  try {
    // Prepare headers for the backend request
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    // Forward the request to your backend
    const response = await fetch(`${REST_API_BASE_URL}/api/events/`, {
      method: "GET",
      headers,
    })

    // Get the response data
    const data = await response.json()

    // Return the response
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

// Add other methods (POST, PUT, DELETE) as needed
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Get token from cookies - use await
    const cookieStore = await cookies()
    const token = cookieStore.get("access_token")?.value

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (token) {
      headers["Authorization"] = `Token ${token}`
    }

    const response = await fetch(`${REST_API_BASE_URL}/api/events/`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}

