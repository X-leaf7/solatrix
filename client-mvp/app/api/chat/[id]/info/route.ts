import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

import { REST_API_BASE_URL } from "@/shared/constants"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  console.log('Fetching chat room info')
  try {
    const { id } = await params
    console.log('chat room id: ', id)

    // Get token from cookies
    const cookieStore = await cookies()
    const token = cookieStore.get("split_access_token")?.value

    if (!token) {
      return NextResponse.json({ detail: "Authentication required" }, { status: 401 })
    }

    console.log('sending request: ', REST_API_BASE_URL)

    // Forward the request to your backend
    const response = await fetch(`${REST_API_BASE_URL}/api/chatroom/${id}/room_info/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })

    // Check if the response is OK before trying to parse JSON
    if (!response.ok) {
      // Try to get error details, but handle case where response isn't JSON
      let errorDetail = `Server responded with status: ${response.status}`
      try {
        const errorData = await response.json()
        errorDetail = errorData.detail || errorDetail
      } catch (parseError) {
        // If we can't parse JSON, try to get the text content
        console.error(parseError)
        try {
          const textContent = await response.text()
          errorDetail = textContent.substring(0, 100) + (textContent.length > 100 ? "..." : "")
        } catch (textError) {
          // If we can't get text either, just use the status
          console.error("Failed to parse error response:", textError)
        }
      }

      console.error("API Error:", errorDetail)
      return NextResponse.json({ detail: errorDetail }, { status: response.status })
    }

    // Now we know the response is OK, parse the JSON
    const data = await response.json()

    // Transform the data to match the updated ChatRoomInfo interface
    const chatRoomInfo = {
      homeTeam: data.homeTeam,
      awayTeam: data.awayTeam,
      score: {
        homeTeamScore: data.score.homeTeamScore,
        awayTeamScore: data.score.awayTeamScore,
      },
      eventStartTime: data.eventStartTime, // Changed from matchTime to eventStartTime
      hostName: data.hostName,
      roomMemberCount: data.roomMemberCount,
    }

    return NextResponse.json(chatRoomInfo)
  } catch (error) {
    console.error("Error fetching chat room info:", error)
    return NextResponse.json(
      {
        detail: "An unexpected error occurred",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
