import { WS_API_BASE_URL } from '../../../shared/constants'

class ChatWebSocketService {
  private static instance: ChatWebSocketService
  private ws: WebSocket | null = null
  private messageHandlers: Record<string, ((data: any) => void)[]> = {}

  private constructor() { }

  public static getInstance(): ChatWebSocketService {
    if (!ChatWebSocketService.instance) {
      ChatWebSocketService.instance = new ChatWebSocketService()
    }
    return ChatWebSocketService.instance
  }

  connect(roomId: string, userId: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) return

    this.ws = new WebSocket(
      `${WS_API_BASE_URL}/ws/chat/${roomId}/?user_id=${userId}`,
    )

    this.ws.onopen = () => console.log('WebSocket connected')
    this.ws.onclose = () => console.log('WebSocket disconnected')
    this.ws.onerror = (error) => console.error('WebSocket error:', error)

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      const handlers = this.messageHandlers[data.type]
      if (handlers) {
        handlers.forEach((handler) => handler(data))
      }
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  sendMessage(type: string, payload: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, ...payload }))
    } else {
      console.error('WebSocket is not connected')
    }
  }

  registerOnMessageHandler(type: string, handler: (data: any) => void) {
    console.log(`registering ${type} handler`)
    if (!this.messageHandlers[type]) {
      this.messageHandlers[type] = []
    }
    this.messageHandlers[type].push(handler)
    console.log('registered: ', this.messageHandlers[type])
  }

  unRegisterOnMessageHandler(type: string, handler: (data: any) => void) {
    console.log(`unregistering ${type} handler`)
    if (this.messageHandlers[type]) {
      this.messageHandlers[type] = this.messageHandlers[type].filter(
        (h) => h !== handler
      )

      if (this.messageHandlers[type].length === 0) {
        delete this.messageHandlers[type]
      }
    }
    console.log('unregistered: ', this.messageHandlers[type])
  }

  get connectionStatus(): string {
    if (!this.ws) return 'DISCONNECTED'
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'CONNECTING'
      case WebSocket.OPEN:
        return 'OPEN'
      case WebSocket.CLOSING:
        return 'CLOSING'
      case WebSocket.CLOSED:
        return 'CLOSED'
      default:
        return 'UNKNOWN'
    }
  }
}

export const chatWebsocketService = ChatWebSocketService.getInstance()
