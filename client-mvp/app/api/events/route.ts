import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

import { REST_API_BASE_URL } from "@/shared/constants"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const queryString = searchParams.toString()

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    const backendUrl = `${REST_API_BASE_URL}/api/events/${queryString ? `?${queryString}` : ''}`

    const response = await fetch(backendUrl, {
      method: "GET",
      headers,
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error || data?.detail || "Unknown error" },
        { status: response.status }
      )
    }

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
    const token = cookieStore.get("split_access_token")?.value

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

