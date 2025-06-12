import { type NextRequest, NextResponse } from "next/server"
import { REST_API_BASE_URL } from "@/shared/constants"

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header from the incoming request
    const authHeader = request.headers.get("Authorization")

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the form data from the request
    const formData = await request.formData()

    // Forward the request to your Django backend
    const response = await fetch(`${REST_API_BASE_URL}/users/upload-image/`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
      },
      body: formData,
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to upload image" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error uploading image:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
