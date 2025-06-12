import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

import { REST_API_BASE_URL } from "@/shared/constants"

export async function GET(request: NextRequest) {
  try {
    // Extract query parameters from the request URL
    const { searchParams } = new URL(request.url)
    const queryString = searchParams.toString()
    
    // Log the query parameters for debugging
    console.log(`Forwarding participated events request with query params: ${queryString}`)
    
    // Get token from cookies - required for participated events
    const cookieStore = await cookies()
    const token = cookieStore.get("split_access_token")?.value
    
    // If no token is available, return unauthorized
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
    
    // Prepare headers for the backend request
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "Authorization": `Token ${token}`
    }

    // Construct the URL with query parameters
    const backendUrl = `${REST_API_BASE_URL}/api/events/participated/${queryString ? `?${queryString}` : ''}`
    console.log(`Sending request to: ${backendUrl}`)
    
    // Forward the request to your backend
    const response = await fetch(backendUrl, {
      method: "GET",
      headers,
    })

    // Check if the response is ok
    if (!response.ok) {
      console.error(`Backend responded with status: ${response.status}`)
      
      // Handle specific error cases
      if (response.status === 401) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 })
      }
      
      return NextResponse.json(
        { error: `Backend responded with status: ${response.status}` }, 
        { status: response.status }
      )
    }

    // Get the response data
    const data = await response.json()

    // Return the response
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching participated events:", error)
    return NextResponse.json({ error: "Failed to fetch participated events" }, { status: 500 })
  }
}