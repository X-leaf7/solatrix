import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { REST_API_BASE_URL } from "@/shared/constants"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { chatRoomId, invitationCode, supportedTeam } = body

    // Get token from cookies
    const cookieStore = await cookies()
    const token = cookieStore.get("split_access_token")?.value

    if (!token) {
      return NextResponse.json({ valid: false, message: "Authentication required" }, { status: 401 })
    }

    // Forward the request to your backend
    // Updated to use the viewset action endpoint
    const response = await fetch(`${REST_API_BASE_URL}/api/chatroom/check_invitation/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        chat_room_id: chatRoomId,
        invitation_code: invitationCode,
        supported_team: supportedTeam || "neutral",
      }),
    })

    const data = await response.json()

    // Return the response with the same status code
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Error checking chat invitation:", error)
    return NextResponse.json({ valid: false, message: "An unexpected error occurred" }, { status: 500 })
  }
}
