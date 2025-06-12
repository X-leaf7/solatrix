import { type NextRequest, NextResponse } from "next/server"
import { REST_API_BASE_URL } from "@/shared/constants"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    // Get token from cookies
    const cookieStore = await cookies()
    const token = cookieStore.get("split_access_token")?.value
    
    if (!token) {
      return NextResponse.json({ detail: "Authentication required" }, { status: 401 })
    }

    // Get the form data from the request
    const formData = await request.formData()
    
    // Check if avatar file exists
    if (!formData.has('avatar')) {
      return NextResponse.json({ error: "No avatar file provided" }, { status: 400 })
    }

    // Forward the request to the backend API
    const response = await fetch(`${REST_API_BASE_URL}/api/profiles/upload_avatar/`, {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
      },
      // Pass the form data directly
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json({ error: errorData.detail || "Failed to upload avatar" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error uploading avatar:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
