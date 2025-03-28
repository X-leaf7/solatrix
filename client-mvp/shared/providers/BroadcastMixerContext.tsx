'use client'

import { createContext, type ReactNode, type ReactElement } from "react"
import useBroadcastMixer, { type UseBroadcastMixerReturn } from "@/shared/hooks/useBroadCastMixer"

// Create the context with a default value
// We're using the UseBroadcastMixerReturn type from the hook
const BroadcastMixerContext = createContext<UseBroadcastMixerReturn>({
  micMuted: false,
  setMicMuted: () => {},
  addMixerDevice: async () => {},
  addMixerDevices: async () => {},
  refreshMixer: async () => {},
  removeMixerDevice: async () => {},
  removeOldDevices: async () => {},
  getMixerDevice: () => undefined,
  mixerDevicesRef: { current: [] },
  toggleMute: () => {},
})

// Define the props interface for the provider component
interface BroadcastMixerProviderProps {
  children: ReactNode
}

function BroadcastMixerProvider({ children }: BroadcastMixerProviderProps): ReactElement {
  const {
    micMuted,
    setMicMuted,
    addMixerDevice,
    addMixerDevices,
    refreshMixer,
    removeMixerDevice,
    removeOldDevices,
    getMixerDevice,
    mixerDevicesRef,
    toggleMute,
  } = useBroadcastMixer()

  return (
    <BroadcastMixerContext.Provider
      value={{
        micMuted,
        setMicMuted,
        addMixerDevice,
        addMixerDevices,
        removeMixerDevice,
        removeOldDevices,
        refreshMixer,
        getMixerDevice,
        mixerDevicesRef,
        toggleMute,
      }}
    >
      {children}
    </BroadcastMixerContext.Provider>
  )
}

export { BroadcastMixerContext, BroadcastMixerProvider }
export type { UseBroadcastMixerReturn }

