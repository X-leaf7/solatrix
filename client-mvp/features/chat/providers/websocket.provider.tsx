'use client'

import React, { createContext, useContext } from 'react'
import { chatWebsocketService } from '../service/websocket.service'

const WebSocketContext = createContext<typeof chatWebsocketService | null>(null)

interface IWebSocketProvider {
  children: React.ReactNode
}

export const WebSocketProvider: React.FC<IWebSocketProvider> = ({ children }) => {
  return (
    <WebSocketContext.Provider value={chatWebsocketService}>
      {children}
    </WebSocketContext.Provider>
  )
}

export const useWebSocket = () => {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider')
  }
  return context
}
