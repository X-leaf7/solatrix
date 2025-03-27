"use client"

import type React from "react"
import useBroadcastLayout, { type UseBroadcastLayoutReturn } from "@/hooks/useBroadcastLayout"
import { createContext, useMemo, type ReactNode } from "react"

// Create the context with a properly typed default value
const BroadcastLayoutContext = createContext<UseBroadcastLayoutReturn>({
  layersRef: { current: [] },
  camActive: false,
  setCamActive: () => {},
  screenShareActive: false,
  toggleScreenSharing: async () => {},
  toggleCamVisiblity: () => {},
  showScreenShare: async () => {},
  showFullScreenCam: async () => {},
  refreshCurrentScene: async () => {},
  removeAllLayers: async () => {},
})

// Define the props interface for the provider component
interface BroadcastLayoutProviderProps {
  children: ReactNode
}

function BroadcastLayoutProvider({ children }: BroadcastLayoutProviderProps): React.ReactElement {
  const {
    layersRef,
    camActive,
    setCamActive,
    screenShareActive,
    toggleScreenSharing,
    toggleCamVisiblity,
    showScreenShare,
    showFullScreenCam,
    refreshCurrentScene,
    removeAllLayers,
  } = useBroadcastLayout()

  return (
    <BroadcastLayoutContext.Provider
      value={useMemo(() => {
        return {
          layersRef,
          camActive,
          setCamActive,
          screenShareActive,
          toggleScreenSharing,
          toggleCamVisiblity,
          showScreenShare,
          showFullScreenCam,
          refreshCurrentScene,
          removeAllLayers,
        }
      }, [
        layersRef,
        camActive,
        setCamActive,
        screenShareActive,
        toggleScreenSharing,
        toggleCamVisiblity,
        showScreenShare,
        showFullScreenCam,
        refreshCurrentScene,
        removeAllLayers,
      ])}
    >
      {children}
    </BroadcastLayoutContext.Provider>
  )
}

export { BroadcastLayoutContext, BroadcastLayoutProvider }
export type { UseBroadcastLayoutReturn }

