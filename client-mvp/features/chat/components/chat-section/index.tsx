"use client"

import { useCallback, useEffect, useRef } from "react"
import { getCookie } from "cookies-next/client"

import { ChatEventCard } from "./card"
import { ChatEventInfo } from "./info"
import { ChatSubmitForm } from "../submit-form"
import { MessageItem } from "../message-item"
import type { Message, SocketMessage } from "../../types"

import { useChatContext, useWebSocket } from "../../providers"
import { useBreakPoint } from "@/shared/hooks/use-breakpoint"
import styles from "./styles.module.sass"
import { cx } from "cva"

interface ChatSectionProps {
  isPublicRoom?: boolean
}

export const ChatSection: React.FC<ChatSectionProps> = ({ isPublicRoom }) => {
  const userCookie = getCookie("user")
  let userId = "anonymous"

  if (userCookie) {
    const userData = JSON.parse(userCookie as string)
    userId = userData.id || userData.user_id || "anonymous"
  }

  const breakpointState = useBreakPoint()

  // Add refs for height calculation
  const sectionRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const messagesRef = useRef<HTMLDivElement>(null)

  const messageUpdateReasonRef = useRef<string>('initial-loading')

  const {
    messages,
    userMessages,
    addMessage,
    addHostMessage,
    addUserMessage
  } = useChatContext()
  const websocketService = useWebSocket()

  // <--------------- Handle Websocket Events ---------------->
  const handleMessageReceive = useCallback(
    (data: SocketMessage) => {
      const newMessage: Message = {
        id: data.message_id,
        text: data.message,
        firstName: data.first_name,
        lastName: data.last_name,
        isHostMessage: data.is_host_message,
        profileImage: data.profile_image_url,
        isCurrentUser: data.sender_id === userId,
        selectedTeam: data.selected_team
      }

      addMessage(newMessage)

      messageUpdateReasonRef.current = 'websocket'

      if (newMessage.isHostMessage) {
        addHostMessage(newMessage)
      } else {
        addUserMessage(newMessage)
      }
    },
    [userId, addMessage, addHostMessage, addUserMessage],
  )

  useEffect(() => {
    websocketService.unRegisterOnMessageHandler("message_received", handleMessageReceive)

    websocketService.registerOnMessageHandler("message_received", handleMessageReceive)

    return () => {
      websocketService.unRegisterOnMessageHandler("message_received", handleMessageReceive)
    }
  }, [websocketService, handleMessageReceive])

  // <--------------------------- HANDLE RESIZING ------------------------------>
  useEffect(() => {
    if (isPublicRoom) return
    if (!sectionRef.current || !messagesRef.current || !cardRef.current || !formRef.current) return
    // Function to reset styles for mobile mode
    const resetMobileStyles = () => {
      if (messagesRef.current) {
        // Reset to default/auto for mobile
        messagesRef.current.style.height = "auto"
        messagesRef.current.style.maxHeight = "320px"
        messagesRef.current.style.overflowY = "auto"
      }
    }

    const updateMessageListHeight = () => {
      if (breakpointState.isMobileLarge) return
      if (!sectionRef.current || !messagesRef.current || !cardRef.current || !formRef.current) return

      const sectionHeight = sectionRef.current.getBoundingClientRect().height
      const cardHeight = cardRef.current.getBoundingClientRect().height
      const formHeight = formRef.current.getBoundingClientRect().height

      // Calculate info height only if not mobile and the element exists
      let infoHeight = 0
      if (!breakpointState.isMobileLarge && infoRef.current) {
        infoHeight = infoRef.current.getBoundingClientRect().height
      }

      // Calculate available height for messages
      const messagesHeight = sectionHeight - cardHeight - infoHeight - formHeight

      // Set the height of the messages list
      if (messagesHeight > 0) {
        messagesRef.current.style.height = `${messagesHeight - 16}px`
        messagesRef.current.style.maxHeight = `${messagesHeight - 16}px`
        messagesRef.current.style.overflowY = "auto"
      }
    }

    // Initial calculation
    setTimeout(updateMessageListHeight, 100)

    // Set up ResizeObserver to watch for section height changes
    const resizeObserver = new ResizeObserver(() => {
      updateMessageListHeight()
    })

    resizeObserver.observe(sectionRef.current)

    // Also observe the other elements that might affect the calculation
    if (cardRef.current) resizeObserver.observe(cardRef.current)
    if (!breakpointState.isMobileLarge && infoRef.current) resizeObserver.observe(infoRef.current)
    if (formRef.current) resizeObserver.observe(formRef.current)

    // Also listen for window resize events as a fallback
    const handleResize = () => {
      updateMessageListHeight()
    }

    if (!breakpointState.isMobileLarge) {
      window.addEventListener("resize", handleResize)
    } else {
      window.removeEventListener("resize", handleResize)
      resetMobileStyles()
    }

    // Clean up
    return () => {
      resizeObserver.disconnect()
      window.removeEventListener("resize", handleResize)
    }
  }, [breakpointState.isMobileLarge, isPublicRoom])

  // <--------------------- HANDLE INITIAL LOADING SCROLL ----------------------->
  useEffect(() => {
    if (messagesRef.current && messageUpdateReasonRef.current === 'initial-loading') {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [messages, userMessages])

  return (
    <section className={styles.base} ref={sectionRef}>
      <div ref={cardRef}>
        <ChatEventCard />
      </div>

      {!breakpointState.isMobileLarge && (
        <div ref={infoRef}>
          <ChatEventInfo />
        </div>
      )}

      <div className={styles.box}>
        <div ref={messagesRef} className={cx(styles.messagesWrapper, isPublicRoom && styles["public-room"])}>
          <ul className={styles.messages} style={{ overflowY: "auto" }}>
            {breakpointState.isMobileLarge &&
              messages.map((message: Message) => <MessageItem key={message.id} message={message} />)}
            {!breakpointState.isMobileLarge &&
              userMessages.map((message: Message) => <MessageItem key={message.id} message={message} />)}
          </ul>
        </div>
        <div ref={formRef}>
          <ChatSubmitForm />
        </div>
      </div>
    </section>
  )
}
