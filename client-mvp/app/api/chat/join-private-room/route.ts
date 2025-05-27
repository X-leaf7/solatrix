import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { REST_API_BASE_URL } from "@/shared/constants"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { chatRoomId, invitationCode, supportedTeam } = body

    if (!chatRoomId || !invitationCode || !supportedTeam) {
      return NextResponse.json(
        {"message": "Invalid request parameters"},
        { status: 400 }
      )
    }

    const cookieStore = await cookies()
    const token = cookieStore.get("split_access_token")?.value

    if (!token) {
      return NextResponse.json({ message: "Authentication required"}, {status: 401})
    }

    const response = await fetch(`${REST_API_BASE_URL}/api/chatroom/join_private_room/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        chat_room_id: chatRoomId,
        invitation_code: invitationCode,
        supported_team: supportedTeam
      })
    })

    let data

    try {
      data = response.json()
    } catch {
      data = {"message": "Invalid JSON response from the backend"}
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Error checking chat invitation:", error)
    return NextResponse.json({ valid: false, message: "An unexpected error occurred" }, { status: 500 })
  }
}
