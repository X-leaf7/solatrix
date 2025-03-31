"use client"

import type React from "react"
import { useContext, useRef, useState, type RefObject } from "react"
import toast from "react-hot-toast"

import useLocalStorage from "@/shared/hooks/useLocalStorage"
import { UserSettingsContext } from "@/shared/providers/UserSettingsContext"

import { debounce } from "@/shared/utils/helper"
import {
  getCameraStream,  
  getMicrophoneStream,
  getAvailableDevices,
  getScreenshareStream,
  getIdealDevice,
  getDisconnectedDevices,
  getConnectedDevices,
} from "@/shared/utils/localMedia"

// Define interfaces for device objects
interface MediaDevice {
  label: string
  value: string
}

// Define interface for the return value of getAvailableDevices
interface AvailableDevices {
  videoDevices: MediaDeviceInfo[]
  audioDevices: MediaDeviceInfo[]
  permissions: boolean
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

// Define interface for the UserSettingsContext
interface UserSettingsContextType {
  configRef: RefObject<{
    width?: number
    height?: number
  }>
  orientation: "LANDSCAPE" | "PORTRAIT"
}

// Define interface for the return value of useLocalMedia
interface UseLocalMediaReturn {
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

// Define interface for camera stream options
interface CameraStreamOptions {
  deviceId: string
  width: number
  height: number
  facingMode: string
  frameRate: number
  aspectRatio: number
}

// Define interface for refresh scene parameters
interface RefreshSceneParams {
  micContent?: MediaStream
  micId?: string
  cameraContent?: MediaStream
  cameraId?: string
}

function useLocalMedia(): UseLocalMediaReturn {
  const { configRef, orientation } = useContext(UserSettingsContext)

  const videoElemRef = useRef<HTMLVideoElement>(undefined)
  const canvasElemRef = useRef<HTMLCanvasElement>(undefined)
  const localAudioStreamRef = useRef<MediaStream>(undefined)
  const localVideoStreamRef = useRef<MediaStream>(undefined)
  const localVideoDeviceIdRef = useRef<string>(undefined)
  const localAudioDeviceIdRef = useRef<string>(undefined)
  const localScreenShareRef = useRef<MediaStream>(undefined)
  const refreshSceneRef = useRef<(params: RefreshSceneParams) => void>(undefined)

  const [permissions, setPermissions] = useState<boolean>(false)
  const [audioDevices, setAudioDevices] = useState<MediaDevice[]>([])
  const [videoDevices, setVideoDevices] = useState<MediaDevice[]>([])
  const [localVideoMounted, setLocalVideoMounted] = useState<boolean>(false)
  const [localAudioMounted, setLocalAudioMounted] = useState<boolean>(false)
  const [enableCanvasCamera, setEnableCanvasCamera] = useState<boolean>(false)

  const [savedAudioDeviceId, setSavedAudioDeviceId] = useLocalStorage<string | undefined>(
    "savedAudioDeviceId",
    undefined,
  )
  const [savedVideoDeviceId, setSavedVideoDeviceId] = useLocalStorage<string | undefined>(
    "savedVideoDeviceId",
    undefined,
  )

  const setInitialDevices = async (): Promise<InitialDevices> => {
    console.log('Set Initial Devices is called')
    const {
      videoDevices: _videoDevices,
      audioDevices: _audioDevices,
      permissions: _permissions,
    } = await refreshDevices()

    console.log(('refreshed devices, getting ideal devices'))

    const audioDeviceId = getIdealDevice(savedAudioDeviceId, _audioDevices)
    const videoDeviceId = getIdealDevice(savedVideoDeviceId, _videoDevices)

    console.log('ideal devices: ',
      audioDeviceId,
      videoDeviceId
    )

    const audioStream = await updateLocalAudio(audioDeviceId)
    const videoStream = await updateLocalVideo(videoDeviceId)

    navigator.mediaDevices.addEventListener("devicechange", handleDeviceChange)

    return { audioDeviceId, audioStream, videoDeviceId, videoStream }
  }

  const cleanUpDevices = (): void => {
    if (navigator.mediaDevices) {
      navigator.mediaDevices.removeEventListener("devicechange", handleDeviceChange)
    }
  }

  const refreshDevices = async (e?: Event): Promise<RefreshedDevices> => {
    const isDeviceChange = e?.type === "devicechange"

    const {
      videoDevices: _videoDevices,
      audioDevices: _audioDevices,
      permissions,
    } = await getAvailableDevices({ savedAudioDeviceId, savedVideoDeviceId })

    const formattedAudioDevices: MediaDevice[] = _audioDevices.map((device: any) => {
      return { label: device.label, value: device.deviceId }
    })
    const formattedVideoDevices: MediaDevice[] = _videoDevices.map((device: any) => {
      return { label: device.label, value: device.deviceId }
    })

    let newAudioDevice: MediaDevice | undefined
    let newVideoDevice: MediaDevice | undefined

    setAudioDevices((prevState) => {
      if (!isDeviceChange) return formattedAudioDevices
      if (prevState.length > formattedAudioDevices.length) {
        // Device disconnected
        const [disconnectedDevice] = getDisconnectedDevices(prevState, formattedAudioDevices)
        if (disconnectedDevice.value === localAudioDeviceIdRef.current) {
          // Currently active device was disconnected
          newAudioDevice = formattedAudioDevices.find(({ value }) => value === "default") || formattedAudioDevices[0]
        }

        toast.error(`Device disconnected: ${disconnectedDevice.label}`, {
          id: "MIC_DEVICE_UPDATE",
        })
      } else if (prevState.length < formattedAudioDevices.length) {
        // Device connected
        const [connectedDevice] = getConnectedDevices(prevState, formattedAudioDevices)
        toast.success(`Device connected: ${connectedDevice.label}`, {
          id: "MIC_DEVICE_UPDATE",
        })
      }
      return formattedAudioDevices
    })

    setVideoDevices((prevState) => {
      if (!isDeviceChange) return formattedVideoDevices
      if (prevState.length > formattedVideoDevices.length) {
        // Device disconnected
        const [disconnectedDevice] = getDisconnectedDevices(prevState, formattedVideoDevices)

        if (disconnectedDevice.value === localAudioDeviceIdRef.current) {
          // Currently active device was disconnected
          newVideoDevice = formattedVideoDevices.find(({ value }) => value === "default") || formattedVideoDevices[0]
        }

        toast.error(`Device disconnected: ${disconnectedDevice.label}`, {
          id: "CAM_DEVICE_UPDATE",
        })
      } else if (prevState.length < formattedVideoDevices.length) {
        // Device connected
        const [connectedDevice] = getConnectedDevices(prevState, formattedVideoDevices)
        toast.success(`Device connected: ${connectedDevice.label}`, {
          id: "CAM_DEVICE_UPDATE",
        })
      }
      return formattedVideoDevices
    })

    let newAudioStream: MediaStream | undefined
    let newVideoStream: MediaStream | undefined

    if (newAudioDevice) newAudioStream = await updateLocalAudio(newAudioDevice.value, formattedAudioDevices)
    if (newVideoDevice) newVideoStream = await updateLocalVideo(newVideoDevice.value, formattedVideoDevices)

    if (refreshSceneRef.current) {
      const newParams: RefreshSceneParams = {}
      if (newAudioStream) newParams.micContent = newAudioStream
      if (newAudioDevice) newParams.micId = newAudioDevice.value
      if (newVideoStream) newParams.cameraContent = newVideoStream
      if (newVideoDevice) newParams.cameraId = newVideoDevice.value
      refreshSceneRef.current(newParams)
    }

    setPermissions(permissions)

    return {
      audioDevices: formattedAudioDevices,
      videoDevices: formattedVideoDevices,
      permissions,
    }
  }

  const updateLocalAudio = async (
    deviceId: string | undefined,
    _audioDevices: MediaDevice[] = audioDevices,
  ): Promise<MediaStream | undefined> => {
    try {
      if (localAudioStreamRef.current && localAudioStreamRef.current.getTracks()[0]) {
        localAudioStreamRef.current.getTracks()[0].stop()
      }
    } catch (err) {
      console.error(err)
    }
    const audioStream = await setLocalAudioFromId(deviceId)
    localAudioDeviceIdRef.current = deviceId
    setSavedAudioDeviceId(deviceId)

    const device = _audioDevices.find((device) => {
      return device.value === deviceId
    })
    if (device) {
      toast.success(`Changed mic: ${device.label}`, {
        id: "MIC_DEVICE_UPDATE",
        duration: 5000,
      })
    }

    return audioStream
  }

  const updateLocalVideo = async (
    deviceId: string | undefined,
    _videoDevices: MediaDevice[] = videoDevices,
  ): Promise<MediaStream | undefined> => {
    try {
      if (localVideoStreamRef.current && localVideoStreamRef.current.getTracks()[0]) {
        localVideoStreamRef.current.getTracks()[0].stop()
      }
    } catch (err) {
      console.error(err)
    }

    let videoStream
    if (deviceId) {
      videoStream = await setLocalVideoFromId(deviceId)
    }
    localVideoDeviceIdRef.current = deviceId
    setSavedVideoDeviceId(deviceId)

    const device = _videoDevices.find((device) => device.value === deviceId)
    if (device) {
      toast.success(`Changed camera: ${device.label}`, {
        id: "CAM_DEVICE_UPDATE",
        duration: 5000,
      })
    }

    return videoStream
  }

  const startScreenShare = async (): Promise<MediaStream | undefined> => {
    let screenShareStream: MediaStream | undefined = undefined
    try {
      screenShareStream = await getScreenshareStream()
      localScreenShareRef.current = screenShareStream
    } catch (err) {
      console.error(err)
    }
    return screenShareStream
  }

  const stopScreenShare = async (): Promise<void> => {
    if (localScreenShareRef.current?.getTracks()) {
      for (const track of localScreenShareRef.current.getTracks()) {
        track.stop()
      }
    }
  }

  const setLocalVideoFromId = async (deviceId: string): Promise<MediaStream | undefined> => {
    const _config = configRef.current ? configRef.current : { width: undefined, height: undefined }
    const { width = 1280, height = 720 } = _config
    const videoStream = await getCameraStream({
      deviceId,
      width,
      height,
      facingMode: "environment",
      frameRate: 30,
      aspectRatio: orientation === "LANDSCAPE" ? 16 / 9 : 9 / 16,
    })
    localVideoStreamRef.current = videoStream
    if (!localVideoMounted) setLocalVideoMounted(true)
    return videoStream
  }

  const setLocalAudioFromId = async (deviceId: string | undefined): Promise<MediaStream | undefined> => {
    const audioStream = await getMicrophoneStream(deviceId)
    localAudioStreamRef.current = audioStream
    if (!localAudioMounted) setLocalAudioMounted(true)
    return audioStream
  }

  const handleDeviceChange = debounce(refreshDevices, 1000)

  return {
    permissions,
    localVideoMounted,
    localAudioMounted,
    audioDevices,
    videoDevices,
    localAudioStreamRef,
    localVideoStreamRef,
    localAudioDeviceId: savedAudioDeviceId,
    localVideoDeviceId: savedVideoDeviceId,
    videoElemRef,
    canvasElemRef,
    refreshSceneRef,
    localScreenShareStreamRef: localScreenShareRef,
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
}

export default useLocalMedia

