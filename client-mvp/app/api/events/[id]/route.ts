import { type NextRequest, NextResponse } from "next/server"
import { REST_API_BASE_URL } from "@/shared/constants"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    const backendUrl = `${REST_API_BASE_URL}/api/events/${id}/`
    console.log(`Fetching event from: ${backendUrl}`)

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Add a timeout to prevent hanging requests
      signal: AbortSignal.timeout(10000),
    })

    // Log the response status for debugging
    console.log(`Backend response status: ${response.status}`)

    if (!response.ok) {
      // Try to get more detailed error information
      let errorDetail = ""
      try {
        const errorData = await response.json()
        errorDetail = JSON.stringify(errorData)
      } catch (e) {
        errorDetail = await response.text()
        console.log(e)
      }

      console.error(`Backend error: ${errorDetail || response.statusText}`)

      return NextResponse.json(
        {
          error: `Failed to fetch event with ID ${id}`,
          details: errorDetail || response.statusText,
        },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    // Log the full error object
    console.error("Error fetching event:", error)

    // Return a more detailed error message
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
