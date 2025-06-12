import { type NextRequest, NextResponse } from "next/server"
import { REST_API_BASE_URL } from "@/shared/constants"
import { cookies } from "next/headers"

export async function GET() {
  try {
    // Get token from cookies
    const cookieStore = await cookies()
    const token = cookieStore.get("split_access_token")?.value
    
    if (!token) {
      return NextResponse.json({ detail: "Authentication required" }, { status: 401 })
    }

    const response = await fetch(`${REST_API_BASE_URL}/api/profiles/me/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch user data" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching user data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get token from cookies
    const cookieStore = await cookies()
    const token = cookieStore.get("split_access_token")?.value
    
    if (!token) {
      return NextResponse.json({ detail: "Authentication required" }, { status: 401 })
    }

    const userData = await request.json()

    const response = await fetch(`${REST_API_BASE_URL}/api/profiles/me/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to update user data" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error updating user data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
