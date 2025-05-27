import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

import { REST_API_BASE_URL } from "@/shared/constants"

interface MessageResponseType {
  id: string
  content: string
  firstName: string
  lastName: string
  isHostMessage: string
  profileImage: string
  isCurrentUser: boolean
  selectedTeam: string
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // Get token from cookies
    const cookieStore = await cookies()
    const token = cookieStore.get("split_access_token")?.value

    if (!token) {
      return NextResponse.json({ detail: "Authentication required" }, { status: 401 })
    }

    // Forward the request to your backend
    const response = await fetch(`${REST_API_BASE_URL}/api/chatroom/${id}/messages/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ detail: data.detail || "Failed to fetch messages" }, { status: response.status })
    }

    const transformedMessages = data.results.map((message: MessageResponseType) => ({
      id: message.id,
      content: message.content,
      firstName: message.firstName,
      lastName: message.lastName,
      isHostMessage: message.isHostMessage,
      profileImage: message.profileImage,
      isCurrentUser: message.isCurrentUser,
      selectedTeam: message.selectedTeam,
    }))

    return NextResponse.json({
      messages: transformedMessages,
      pagination: {
        count: data.count,
        next: data.next,
        previous: data.previous,
      },
    })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ detail: "An unexpected error occurred" }, { status: 500 })
  }
}
