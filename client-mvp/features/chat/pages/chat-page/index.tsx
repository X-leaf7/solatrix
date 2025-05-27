"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { getCookie } from "cookies-next/client"
import { cx } from "cva"

import { useBreakPoint } from "@/shared/hooks"
import { REST_API_BASE_URL } from "@/shared/constants"
import type { ChatRoomInfo, Message } from "../../types"
import { useChatContext, useWebSocket } from "../../providers"
import { ChatHost, ChatVideo, ChatSection } from "../../components"

import styles from "./page.module.sass"

export const ChatPage = () => {
  const params = useParams()
  const searchParams = useSearchParams()

  const chatId = params.id as string
  const isPublicRoom = searchParams.get('isPublicRoom') === 'true'

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const userCookie = getCookie("user")
  let userId = "anonymous"

  if (userCookie) {
    const userData = JSON.parse(userCookie as string)
    userId = userData.id || userData.user_id || "anonymous"
  }

  const breakpointState = useBreakPoint()

  const { setMessages, setHostMessages, setUserMessages, setChatRoomInfo } = useChatContext()

  // Add refs for the host and chat divs
  const hostRef = useRef<HTMLDivElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)
  const advertisingRef = useRef<HTMLDivElement>(null)
  const chatSectionRef = useRef<HTMLDivElement>(null)

  // <---------------------- HANDLE DATA FETCHING ------------------------>
  const fetchChatMessages = async (
    chatId: string,
  ) => {
    const response = await fetch(
      `${REST_API_BASE_URL}/api/chatroom/${chatId}/messages/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Failed to fetch messages")
    }

    const data = await response.json()

    const transformedMessages = data.results.map((message: any) => ({
      id: message.id,
      text: message.content,
      firstName: message.firstName,
      lastName: message.lastName,
      isHostMessage: message.isHostMessage,
      profileImage: message.profileImage,
      isCurrentUser: message.isCurrentUser,
      selectedTeam: message.selectedTeam,
    }))
    
    return transformedMessages
  }

  const fetchChatRoomInfo = async (chatId: string) => {
    const response = await fetch(`${REST_API_BASE_URL}/api/chatroom/${chatId}/room_info/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    console.log('fetch chat room info response: ', response)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Failed to fetch chat room info")
    }

    const data = await response.json()
    console.log('chat room info response: ', data)
    return data as ChatRoomInfo
  }

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const [messages, chatRoomInfo] = await Promise.all([
        fetchChatMessages(chatId),
        fetchChatRoomInfo(chatId),
      ]);

      // Set all messages
      setMessages(messages)
      setChatRoomInfo(chatRoomInfo)

      // Filter host messages
      const hostMessages = messages.filter((message: Message) => message.isHostMessage)

      // Filter user messages (non-host messages)
      const userMessages = messages.filter((message: Message) => !message.isHostMessage)
      
      // Set filtered messages in context
      setHostMessages(hostMessages)
      setUserMessages(userMessages)
    } catch (err) {
      console.error("Error fetching chat room data and messages:", err)
      setError("Failed to load chat messages. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }, [
    chatId,
    setMessages,
    setHostMessages,
    setUserMessages,
    setChatRoomInfo
  ])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // <---------------------- HANDLE SIZING ------------------------>
  useEffect(() => {
    if (!hostRef.current || !chatRef.current) return
    if (isPublicRoom) return

    // Function to reset styles for mobile mode
    const resetMobileStyles = () => {
      if (chatRef.current) {
        chatRef.current.style.height = "auto"
        chatRef.current.style.minHeight = ""
        chatRef.current.style.maxHeight = ""
      }

      if (chatSectionRef.current) {
        chatSectionRef.current.style.height = "auto"
        chatSectionRef.current.style.maxHeight = ""
      }

      if (advertisingRef.current) {
        advertisingRef.current.style.height = ""
      }
    }

    // Function to update chat height
    const updateChatHeight = () => {
      if (breakpointState.isMobileLarge) return
      if (hostRef.current && chatRef.current) {
        const hostHeight = hostRef.current.getBoundingClientRect().height

        // Force layout recalculation
        chatRef.current.style.height = `${hostHeight}px`
        chatRef.current.style.minHeight = `${hostHeight}px`
        chatRef.current.style.maxHeight = `${hostHeight}px`

        if (advertisingRef.current && chatSectionRef.current) {
          const advertisingHeight = advertisingRef.current.getBoundingClientRect().height
          chatSectionRef.current.style.height = `${hostHeight - advertisingHeight}px`
          chatSectionRef.current.style.maxHeight = `${hostHeight - advertisingHeight}px`
        }
      }
    }

    // Initial height sync with a slight delay to ensure DOM is ready
    setTimeout(updateChatHeight, 100)

    // Set up ResizeObserver to watch for host div height changes
    const resizeObserver = new ResizeObserver(() => {
      updateChatHeight()
    })

    // Also listen for window resize events as a fallback
    const handleResize = () => {
      updateChatHeight()
    }

    if (!breakpointState.isMobileLarge) {
      resizeObserver.observe(hostRef.current)
      window.addEventListener("resize", handleResize)
    } else {
      window.removeEventListener("resize", handleResize)
      resizeObserver.unobserve(hostRef.current)
      resetMobileStyles()
    }

    // Clean up observer and event listener on unmount
    return () => {
      if (hostRef.current) {
        resizeObserver.unobserve(hostRef.current)
      }
      resizeObserver.disconnect()
      window.removeEventListener("resize", handleResize)
    }
  }, [breakpointState.isMobileLarge, isPublicRoom])

  // <---------------------- HANDLE SOCKET ------------------------>
  const chatWebsocketService = useWebSocket()

  useEffect(() => {
    chatWebsocketService.disconnect()

    chatWebsocketService.connect(chatId, userId)

    return () => {
      chatWebsocketService.disconnect()
    }
  }, [chatWebsocketService, chatId, userId])

  return (
    <article className={cx(styles.base, styles["has-video"], isPublicRoom && styles["has-public-room"])}>
      {!isPublicRoom && (
        <div id="host" className={styles.host} ref={hostRef}>
          {breakpointState.isMobileLarge && (
            <div
              ref={advertisingRef}
              className={styles.advertising}
            />
          )}
          <div className={styles.video}>
            <ChatVideo />
          </div>
          {!breakpointState.isMobileLarge && (
            <div className={styles.hostChat}>
              <ChatHost />
            </div>
          )}
        </div>
      )}
      <div
        id="chat"
        className={styles.chat}
        ref={chatRef}
        style={{ height: hostRef.current ? `${hostRef.current.getBoundingClientRect().height}px` : isPublicRoom ? "100%" : "800px" }}
      >
        {!breakpointState.isMobileLarge && (
          <div
            ref={advertisingRef}
            className={styles.advertising}
          />
        )}
        <div ref={chatSectionRef}>
          <ChatSection isPublicRoom={isPublicRoom} />
        </div>
      </div>
    </article>
  )
}

export default ChatPage
