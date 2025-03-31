'use client'

import React, { createContext, useContext } from 'react'
import { websocketService } from '../service/websocket.service'

const WebSocketContext = createContext<typeof websocketService | null>(null)

interface IWebSocketProvider {
  children: React.ReactNode
}

export const WebSocketProvider: React.FC<IWebSocketProvider> = ({ children }) => {
  return (
    <WebSocketContext.Provider value={websocketService}>
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
