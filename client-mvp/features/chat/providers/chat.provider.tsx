"use client"

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode
} from "react"

import { useWebSocket } from "./websocket.provider"
import { ChatRoomInfo, Message } from "../types"

// Define the context type
interface ChatContextType {
  messages: Message[]
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  hostMessages: Message[]
  setHostMessages: React.Dispatch<React.SetStateAction<Message[]>>
  userMessages: Message[]
  setUserMessages: React.Dispatch<React.SetStateAction<Message[]>>
  chatRoomInfo: ChatRoomInfo | undefined
  setChatRoomInfo: React.Dispatch<React.SetStateAction<ChatRoomInfo | undefined>>
  rules: string[]
  addMessage: (message: Message) => void
  addHostMessage: (message: Message) => void
  addUserMessage: (message: Message) => void
  updateMessage: (id: string, text: string) => void
  deleteMessage: (id: string) => void
  setRules: (rules: string[]) => void
  addRule: (rule: string) => void
  removeRule: (index: number) => void
  clearMessages: () => void
  sendMessage: (message: string) => void
}

// Create the context with a default value
const ChatContext = createContext<ChatContextType | undefined>(undefined)

// Provider props type
interface ChatProviderProps {
  children: ReactNode
  initialMessages?: Message[]
  initialRules?: string[]
}

// Create the provider component
export function ChatProvider({ children, initialMessages = [], initialRules = [] }: ChatProviderProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [hostMessages, setHostMessages] = useState<Message[]>([])
  const [userMessages, setUserMessages] = useState<Message[]>([])

  // TODO: Remove dummy data after development
  const [chatRoomInfo, setChatRoomInfo] = useState<ChatRoomInfo>()

  const [rules, setRules] = useState<string[]>(initialRules)

  const chatWebsocketService = useWebSocket()

  // Add a new message
  const addMessage = useCallback((message: Message) => {
    setMessages((prevMessages) => {
      return [
        ...prevMessages,
        message
      ]
    })
  }, [])

  // Add a new message
  const addHostMessage = useCallback((message: Message) => {
    setHostMessages((prevMessages) => {
      return [
        ...prevMessages,
        message
      ]
    })
  }, [])

  // Add a new message
  const addUserMessage = useCallback((message: Message) => {
    setUserMessages((prevMessages) => {
      return [
        ...prevMessages,
        message
      ]
    })
  }, [])

  // Update an existing message
  const updateMessage = useCallback((id: string, text: string) => {
    setMessages((prevMessages) => prevMessages.map((message) => (message.id === id ? { ...message, text } : message)))
  }, [])

  // Delete a message
  const deleteMessage = useCallback((id: string) => {
    setMessages((prevMessages) => prevMessages.filter((message) => message.id !== id))
  }, [])

  // Add a new rule
  const addRule = useCallback((rule: string) => {
    setRules((prevRules) => [...prevRules, rule])
  }, [])

  // Remove a rule by index
  const removeRule = useCallback((index: number) => {
    setRules((prevRules) => prevRules.filter((_, i) => i !== index))
  }, [])

  // Clear all messages
  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  const sendMessage = (message: string) => {
    if (chatWebsocketService.connectionStatus === 'OPEN') {
      console.log('sending message: ', message)
      chatWebsocketService.sendMessage('send_message', {
        message,
      })
    } else {
      alert('WebSocket is disconnected. Please check your connection.')
    }
  }

  // Create the context value object
  const contextValue: ChatContextType = {
    messages,
    setMessages,
    hostMessages,
    setHostMessages,
    userMessages,
    setUserMessages,
    chatRoomInfo,
    setChatRoomInfo,
    rules,
    addMessage,
    addHostMessage,
    addUserMessage,
    updateMessage,
    deleteMessage,
    setRules,
    addRule,
    removeRule,
    clearMessages,
    sendMessage
  }

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  )
}

// Custom hook to use the chat context
export function useChatContext() {
  const context = useContext(ChatContext)

  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider")
  }

  return context
}

