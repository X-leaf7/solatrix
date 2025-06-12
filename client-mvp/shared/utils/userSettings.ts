"use client"

import useLocalStorage from "@/shared/hooks/useLocalStorage"
import { useEffect, useRef } from "react"
import { isMobileOnly } from "react-device-detect"

const DEFAULT_RESOLUTION: number = 720
const DEFAULT_INGEST: string = ""
const CHANNEL_TYPES = {
  BASIC: "BASIC",
  STANDARD: "STANDARD",
  ADVANCED_HD: "ADVANCED_HD",
  ADVANCED_SD: "ADVANCED_SD",
} as const

type ChannelType = keyof typeof CHANNEL_TYPES
type Orientation = "PORTRAIT" | "LANDSCAPE"

type StreamConfig = {
  maxResolution: { width: number; height: number }
  maxBitrate: number
  maxFramerate: number
}

export function clearSavedSettings(): void {
  if (typeof window !== 'undefined') {
    [
      "channelType",
      "savedAudioDeviceId",
      "savedVideoDeviceId",
      "streamResolution",
      "sk",
      "orientation",
      "ingestEndpoint",
      "localVideoMirror",
      "audioNoiseSuppression",
      "autoGainControl",
      "rememberSettings",
    ].forEach((key) => localStorage.removeItem(key))
  }
}

export function formatConfig({
  width,
  height,
  bitrate: maxBitrate,
}: { width: number; height: number; bitrate: number }): StreamConfig {
  const maxFramerate: number = 30
  return {
    maxResolution: { width, height },
    maxBitrate,
    maxFramerate,
  }
}

export function getConfigFromResolution(
  resolution: number | string,
  channelType: ChannelType,
  orientation: Orientation,
): StreamConfig {
  const isLandscape = orientation === "LANDSCAPE"
  let config
  switch (resolution) {
    case "1080":
      config = {
        width: isLandscape ? 1920 : 1080,
        height: isLandscape ? 1080 : 1920,
        bitrate: channelType === "BASIC" ? 3500 : 8500,
      }
      break
    case "720":
      config = {
        width: isLandscape ? 1620 : 720,
        height: isLandscape ? 720 : 1620,
        bitrate: channelType === "BASIC" ? 3500 : 6500,
      }
      break
    case "480":
      config = {
        width: isLandscape ? 853 : 480,
        height: isLandscape ? 480 : 853,
        bitrate: channelType === "BASIC" ? 1500 : 3500,
      }
      break
    case "360":
      config = {
        width: isLandscape ? 640 : 360,
        height: isLandscape ? 360 : 640,
        bitrate: channelType === "BASIC" ? 1500 : 3500,
      }
      break
    default:
      config = {
        width: isLandscape ? 1620 : 720,
        height: isLandscape ? 720 : 1620,
        bitrate: channelType === "BASIC" ? 3500 : 6500,
      }
      break
  }
  return formatConfig(config)
}

// Renamed to follow React Hook naming convention (starts with "use")
export function useSavedStreamSettings() {
  const [saveSettings, setSaveSettings] = useLocalStorage<boolean>("rememberSettings", false, false)

  const [channelType, setChannelType] = useLocalStorage<ChannelType>("channelType", CHANNEL_TYPES.BASIC, saveSettings)
  const [savedAudioDeviceId, setSavedAudioDeviceId] = useLocalStorage<string | undefined>(
    "savedAudioDeviceId",
    undefined,
    saveSettings,
  )
  const [savedVideoDeviceId, setSavedVideoDeviceId] = useLocalStorage<string | undefined>(
    "savedVideoDeviceId",
    undefined,
    saveSettings,
  )
  const [orientation, setOrientation] = useLocalStorage<Orientation>(
    "orientation",
    isMobileOnly ? "PORTRAIT" : "LANDSCAPE",
    saveSettings,
  )
  const [resolution, setResolution] = useLocalStorage<number | string>(
    "streamResolution",
    DEFAULT_RESOLUTION,
    saveSettings,
  )
  const [streamKey, setStreamKey] = useLocalStorage<string | undefined>("sk", undefined, saveSettings)
  const [ingestEndpoint, setIngestEndpoint] = useLocalStorage<string>("ingestEndpoint", DEFAULT_INGEST, saveSettings)
  const [localVideoMirror, setLocalVideoMirror] = useLocalStorage<boolean>("localVideoMirror", false, saveSettings)
  const [audioNoiseSuppression, setAudioNoiseSuppression] = useLocalStorage<boolean>(
    "audioNoiseSuppression",
    true,
    saveSettings,
  )
  const [autoGainControl, setAutoGainControl] = useLocalStorage<boolean>("autoGainControl", true, saveSettings)

  const configRef = useRef<StreamConfig>(getConfigFromResolution(resolution, channelType, orientation))

  useEffect(() => {
    configRef.current = getConfigFromResolution(resolution, channelType, orientation)
  }, [resolution, channelType, orientation])

  return {
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
  }
}

// Export the channel types for use elsewhere
export { CHANNEL_TYPES }
export type { ChannelType, Orientation, StreamConfig }
