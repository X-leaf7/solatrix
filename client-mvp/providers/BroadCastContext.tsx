'use client'

import { createContext, type ReactNode, type ReactElement } from "react"
import useBroadcastSDK, { type UseBroadcastSDKReturn } from "@/hooks/useBroadCastSDK"

// Define the broadcast status enum
export enum BROADCAST_STATUS {
  LIVE = "LIVE",
  OFFLINE = "OFFLINE",
  LOADING = "LOADING",
  ERROR = "ERROR",
}

// Create the context with a default value
// We're using the UseBroadcastSDKReturn type from the hook
const BroadcastContext = createContext<UseBroadcastSDKReturn>({
  IVSBroadcastClientRef: { current: undefined },
  sdkVersionRef: { current: undefined },
  broadcastClientMounted: false,
  broadcastClientRef: { current: undefined },
  broadcastStartTimeRef: { current: undefined },
  connectionState: undefined,
  isLive: false,
  isSupported: false,
  streamPending: false,
  broadcastErrors: [],
  toggleStream: async () => {},
  stopStream: async () => {},
  startStream: async () => {},
  createBroadcastClient: async () => {
    throw new Error("Not implemented")
  },
  destroyBroadcastClient: () => {},
  restartBroadcastClient: async () => {
    throw new Error("Not implemented")
  },
})

// Define the props interface for the provider component
interface BroadcastProviderProps {
  children: ReactNode
}

function BroadcastProvider({ children }: BroadcastProviderProps): ReactElement {
  const state = useBroadcastSDK()

  return <BroadcastContext.Provider value={state}>{children}</BroadcastContext.Provider>
}

export { BroadcastContext, BroadcastProvider }

