"use client"

import { type ReactNode, createContext } from "react"
import {
  clearSavedSettings,
  useSavedStreamSettings,
  type ChannelType,
  type Orientation as OrientationType,
} from "@/shared/utils/userSettings"

// Define TypeScript interface for context values
interface UserSettingsContextType {
  channelType: ChannelType
  setChannelType: (value: ChannelType) => void
  selectedVideoDeviceId: string | undefined
  setSelectedVideoDeviceId: (value: string | undefined) => void
  selectedAudioDeviceId: string | undefined
  setSelectedAudioDeviceId: (value: string | undefined) => void
  orientation: OrientationType
  setOrientation: (value: OrientationType) => void
  resolution: number | string
  setResolution: (value: number | string) => void
  configRef: any
  streamKey: string | undefined
  setStreamKey: (value: string | undefined) => void
  ingestEndpoint: string
  setIngestEndpoint: (value: string) => void
  localVideoMirror: boolean
  setLocalVideoMirror: (value: boolean) => void
  audioNoiseSuppression: boolean
  setAudioNoiseSuppression: (value: boolean) => void
  autoGainControl: boolean
  setAutoGainControl: (value: boolean) => void
  saveSettings: boolean
  setSaveSettings: (value: boolean) => void
  clearSavedSettings: () => void
}

// Create context with default values (we'll provide actual values in the provider)
const UserSettingsContext = createContext<UserSettingsContextType>({} as UserSettingsContextType)

interface UserSettingsProviderProps {
  children: ReactNode
}

function UserSettingsProvider({ children }: UserSettingsProviderProps) {
  // Use our custom hook to get all the saved values and setters
  const {
    channelType,
    setChannelType,
    savedVideoDeviceId,
    setSavedVideoDeviceId,
    savedAudioDeviceId,
    setSavedAudioDeviceId,
    orientation,
    setOrientation,
    resolution,
    setResolution,
    configRef,
    streamKey,
    setStreamKey,
    ingestEndpoint,
    setIngestEndpoint,
    localVideoMirror,
    setLocalVideoMirror,
    audioNoiseSuppression,
    setAudioNoiseSuppression,
    autoGainControl,
    setAutoGainControl,
    saveSettings,
    setSaveSettings,
  } = useSavedStreamSettings()

  return (
    <UserSettingsContext.Provider
      value={{
        channelType,
        setChannelType,
        selectedVideoDeviceId: savedVideoDeviceId,
        setSelectedVideoDeviceId: setSavedVideoDeviceId,
        selectedAudioDeviceId: savedAudioDeviceId,
        setSelectedAudioDeviceId: setSavedAudioDeviceId,
        orientation,
        setOrientation,
        resolution,
        setResolution,
        streamKey,
        setStreamKey,
        ingestEndpoint,
        setIngestEndpoint,
        localVideoMirror,
        setLocalVideoMirror,
        audioNoiseSuppression,
        setAudioNoiseSuppression,
        autoGainControl,
        setAutoGainControl,
        saveSettings,
        setSaveSettings,
        clearSavedSettings,
        configRef,
      }}
    >
      {children}
    </UserSettingsContext.Provider>
  )
}

export { UserSettingsContext, UserSettingsProvider }
