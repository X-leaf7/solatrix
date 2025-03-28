"use client"

import type React from "react"

import { createContext, useMemo, type ReactNode, type RefObject } from "react"
import useLocalMedia from "@/shared/hooks/useLocalMedia"

// Define a MediaDevice type for consistency
interface MediaDevice {
  label: string
  value: string
}

// Define interface for refresh scene parameters
interface RefreshSceneParams {
  micContent?: MediaStream
  micId?: string
  cameraContent?: MediaStream
  cameraId?: string
}

// Define interface for the return value of refreshDevices
interface RefreshedDevices {
  audioDevices: MediaDevice[]
  videoDevices: MediaDevice[]
  permissions: boolean
}

// Define interface for the return value of setInitialDevices
interface InitialDevices {
  audioDeviceId?: string
  audioStream?: MediaStream
  videoDeviceId?: string
  videoStream?: MediaStream
}

// Define the interface for the context value based on the useLocalMedia hook return type
interface LocalMediaContextType {
  permissions: boolean
  localVideoMounted: boolean
  localAudioMounted: boolean
  audioDevices: MediaDevice[]
  videoDevices: MediaDevice[]
  localAudioStreamRef: RefObject<MediaStream | undefined>
  localVideoStreamRef: RefObject<MediaStream | undefined>
  localAudioDeviceId: string | undefined
  localVideoDeviceId: string | undefined
  videoElemRef: RefObject<HTMLVideoElement | undefined>
  canvasElemRef: RefObject<HTMLCanvasElement | undefined>
  refreshSceneRef: RefObject<((params: RefreshSceneParams) => void) | undefined>
  localScreenShareStreamRef: RefObject<MediaStream | undefined>
  enableCanvasCamera: boolean
  setEnableCanvasCamera: (enable: boolean) => void
  // Update parameter and return types to match the updated hook
  updateLocalAudio: (deviceId: string | undefined, audioDevices?: MediaDevice[]) => Promise<MediaStream | undefined>
  updateLocalVideo: (deviceId: string | undefined, videoDevices?: MediaDevice[]) => Promise<MediaStream | undefined>
  setInitialDevices: () => Promise<InitialDevices>
  cleanUpDevices: () => void
  refreshDevices: (e?: Event) => Promise<RefreshedDevices>
  setAudioDevices: React.Dispatch<React.SetStateAction<MediaDevice[]>>
  setVideoDevices: React.Dispatch<React.SetStateAction<MediaDevice[]>>
  startScreenShare: () => Promise<MediaStream | undefined>
  stopScreenShare: () => Promise<void>
}

// Create a default value for the context with proper types
const defaultContextValue: LocalMediaContextType = {
  permissions: false,
  localVideoMounted: false,
  localAudioMounted: false,
  audioDevices: [],
  videoDevices: [],
  localAudioStreamRef: { current: undefined },
  localVideoStreamRef: { current: undefined },
  localAudioDeviceId: undefined,
  localVideoDeviceId: undefined,
  videoElemRef: { current: undefined },
  canvasElemRef: { current: undefined },
  refreshSceneRef: { current: undefined },
  localScreenShareStreamRef: { current: undefined },
  enableCanvasCamera: false,
  setEnableCanvasCamera: () => {},
  updateLocalAudio: async () => undefined,
  updateLocalVideo: async () => undefined,
  setInitialDevices: async () => ({}),
  cleanUpDevices: () => {},
  refreshDevices: async () => ({ audioDevices: [], videoDevices: [], permissions: false }),
  setAudioDevices: () => {},
  setVideoDevices: () => {},
  startScreenShare: async () => undefined,
  stopScreenShare: async () => {},
}

// Create the context with the default value
const LocalMediaContext = createContext<LocalMediaContextType>(defaultContextValue)

// Define the props interface for the provider component
interface LocalMediaProviderProps {
  children: ReactNode
}

function LocalMediaProvider({ children }: LocalMediaProviderProps) {
  const {
    permissions,
    localVideoMounted,
    localAudioMounted,
    audioDevices,
    videoDevices,
    localAudioStreamRef,
    localVideoStreamRef,
    localAudioDeviceId,
    localVideoDeviceId,
    videoElemRef,
    canvasElemRef,
    refreshSceneRef,
    localScreenShareStreamRef,
    enableCanvasCamera,
    setEnableCanvasCamera,
    updateLocalAudio,
    updateLocalVideo,
    setInitialDevices,
    cleanUpDevices,
    refreshDevices,
    setAudioDevices,
    setVideoDevices,
    startScreenShare,
    stopScreenShare,
  } = useLocalMedia()

  const state = useMemo(() => {
    return {
      permissions,
      localVideoMounted,
      localAudioMounted,
      audioDevices,
      videoDevices,
      localAudioStreamRef,
      localVideoStreamRef,
      localAudioDeviceId,
      localVideoDeviceId,
      videoElemRef,
      canvasElemRef,
      refreshSceneRef,
      localScreenShareStreamRef,
      enableCanvasCamera,
      setEnableCanvasCamera,
      updateLocalAudio,
      updateLocalVideo,
      setInitialDevices,
      cleanUpDevices,
      refreshDevices,
      setAudioDevices,
      setVideoDevices,
      startScreenShare,
      stopScreenShare,
    }
  }, [
    permissions,
    localVideoMounted,
    localAudioMounted,
    audioDevices,
    videoDevices,
    localAudioStreamRef,
    localVideoStreamRef,
    localAudioDeviceId,
    localVideoDeviceId,
    videoElemRef,
    canvasElemRef,
    refreshSceneRef,
    localScreenShareStreamRef,
    enableCanvasCamera,
    setEnableCanvasCamera,
    updateLocalAudio,
    updateLocalVideo,
    setInitialDevices,
    cleanUpDevices,
    refreshDevices,
    setAudioDevices,
    setVideoDevices,
    startScreenShare,
    stopScreenShare,
  ])

  return <LocalMediaContext.Provider value={state}>{children}</LocalMediaContext.Provider>
}

export { LocalMediaContext, LocalMediaProvider }
export type { LocalMediaContextType, MediaDevice, RefreshSceneParams, InitialDevices, RefreshedDevices }

