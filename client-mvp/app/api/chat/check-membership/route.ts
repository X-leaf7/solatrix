import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { REST_API_BASE_URL } from "@/shared/constants"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { chatRoomId } = body

    const cookieStore = await cookies()
    const token = cookieStore.get("split_access_token")?.value

    if (!token) {
      return NextResponse.json(
        { valid: false, message: "Authentication required" },
        { status: 401 }
      )
    }

    const response = await fetch(`${REST_API_BASE_URL}/api/chatroom/check_existing_membership/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        chat_room_id: chatRoomId,
      }),
    })

    let data
    try {
      data = await response.json()
    } catch {
      data = { valid: false, message: "Invalid JSON response from backend" }
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Error checking public chat room:", error)
    return NextResponse.json(
      { valid: false, message: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
