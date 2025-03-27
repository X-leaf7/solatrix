"use client"

import type React from "react"

import { useContext, useRef, useState, type RefObject } from "react"
import { DEFAULT_TEMPLATE, SCREENSHARE_TEMPLATE } from "@/utils/broadcastLayoutTemplates"
import { BroadcastContext } from "@/providers/BroadCastContext"
import { calcScaledCoords, formatPositionFromDimensions } from "@/utils/broadcastLayout"
import { LocalMediaContext } from "@/providers/LocalMediaContext"
import { BroadcastMixerContext } from "@/providers/BroadcastMixerContext"
import toast from "react-hot-toast"

// Define interfaces for the layer types
interface Layer {
  name: string
  type: "image" | "video" | "device"
  visible?: boolean
}

interface Position {
  x: number
  y: number
  width: number
  height: number
  zIndex?: number
  [key: string]: any
}

interface Dimensions {
  x: number
  y: number
  width: number
  height: number
  z?: number
  [key: string]: any
}

interface ResizeConfig {
  mode: "FILL" | "FIT"
  naturalSize: {
    width: number
    height: number
  }
}

interface Slot {
  name: string
  type: "image" | "video" | "device"
  dimensions: Dimensions
  visible: boolean
  content: any
  resize?: ResizeConfig
}

interface Template {
  mixer: any[]
  slots: Slot[]
  update: (props: any) => Template
}

interface AddLayerParams {
  type: "image" | "video" | "device"
  content: any
  name: string
  position: Position
  visible: boolean
}

interface AddImageLayerParams {
  imageSrc: string
  name: string
  position: Position
  visible: boolean
}

interface AddVideoLayerParams {
  videoElem: HTMLVideoElement
  name: string
  position: Position
  visible: boolean
}

interface AddDeviceLayerParams {
  deviceStream: MediaStream
  name: string
  position: Position
  visible: boolean
}

interface UpdateDeviceLayerParams {
  name: string
  position: Position
  visible?: boolean
}

interface RemoveLayerParams {
  name: string
}

interface ShowScreenShareParams {
  cameraStream: MediaStream | HTMLCanvasElement
  cameraId: string
  cameraVisible?: boolean
  cameraIsCanvas?: boolean
  showMuteIcon?: boolean
  micStream: MediaStream
  micId: string
  screenShareStream: MediaStream
  screenShareId: string
  screenAudioContent: MediaStream
  screenAudioId: string
}

interface ShowFullScreenCamParams {
  cameraStream?: MediaStream | HTMLCanvasElement
  cameraId?: string
  cameraVisible?: boolean
  cameraIsCanvas?: boolean
  micStream?: MediaStream
  micId?: string
  showMuteIcon?: boolean
}

// Define the return type for the hook
interface UseBroadcastLayoutReturn {
  layersRef: RefObject<Layer[]>
  camActive: boolean
  setCamActive: React.Dispatch<React.SetStateAction<boolean>>
  screenShareActive: boolean
  toggleScreenSharing: () => Promise<void>
  toggleCamVisiblity: (cameraId: string) => void
  showScreenShare: (params: ShowScreenShareParams) => Promise<void>
  showFullScreenCam: (params: ShowFullScreenCamParams) => Promise<void>
  refreshCurrentScene: (newProps: any) => Promise<void>
  removeAllLayers: (layers?: Layer[]) => Promise<void>
}

const useBroadcastLayout = (): UseBroadcastLayoutReturn => {
  const { broadcastClientRef, IVSBroadcastClientRef } = useContext(BroadcastContext)
  const {
    canvasElemRef,
    localVideoStreamRef,
    localAudioStreamRef,
    startScreenShare,
    stopScreenShare,
    localVideoDeviceId,
    localAudioDeviceId,
    localScreenShareStreamRef,
    enableCanvasCamera,
  } = useContext(LocalMediaContext)
  const { micMuted, mixerDevicesRef, removeMixerDevice, addMixerDevice, addMixerDevices, removeOldDevices } =
    useContext(BroadcastMixerContext)

  const [camActive, setCamActive] = useState<boolean>(true)
  const [screenShareActive, setScreenShareActive] = useState<boolean>(false)
  const layersRef = useRef<Layer[]>([])
  const activeSceneRef = useRef<Template | undefined>(undefined)

  const toggleCamVisiblity = (cameraId: string): void => {
    if (!broadcastClientRef.current || !localVideoStreamRef.current) return

    const currentCam = broadcastClientRef.current.getVideoInputDevice(cameraId)
    const currentVideoTrack = localVideoStreamRef.current.getVideoTracks()[0]

    if (!currentCam || !currentVideoTrack) return

    setCamActive((prevState) => {
      const nextState = !prevState
      currentVideoTrack.enabled = nextState
      currentCam.render = nextState
      // toast.success(`${nextState ? 'Camera shown' : 'Camera hidden'}`, {
      //   id: 'CAMERA_STATE',
      // });
      return nextState
    })
  }

  const stopScreenSharing = async (): Promise<void> => {
    await stopScreenShare()
    if (localScreenShareStreamRef.current) {
      await removeMixerDevice(localScreenShareStreamRef.current.id)
    }

    const cameraContent = enableCanvasCamera ? canvasElemRef.current : localVideoStreamRef.current

    if (cameraContent) {
      await showFullScreenCam({
        cameraStream: cameraContent,
        cameraId: localVideoDeviceId || "",
        cameraVisible: camActive,
        micStream: localAudioStreamRef.current!,
        micId: localAudioDeviceId || "",
        showMuteIcon: micMuted,
      })
    }

    setScreenShareActive(false)
    toast.success("Screen share stopped", { id: "SCREENSHARE_STATUS" })
  }

  const startScreenSharing = async (): Promise<void> => {
    const captureStream = await startScreenShare()

    if (!captureStream) return

    const [screenTrack] = captureStream.getVideoTracks()
    const [audioTrack] = captureStream.getAudioTracks()

    if (screenTrack) {
      screenTrack.onended = async () => {
        await stopScreenSharing()
      }
    }

    if (audioTrack) {
      await addMixerDevice({
        audioStream: captureStream,
        deviceName: captureStream.id,
      })
    }

    if (screenTrack || audioTrack) {
      const cameraContent = enableCanvasCamera ? canvasElemRef.current : localVideoStreamRef.current

      if (cameraContent) {
        await showScreenShare({
          cameraStream: cameraContent,
          cameraId: localVideoDeviceId || "",
          cameraVisible: camActive,
          cameraIsCanvas: enableCanvasCamera,
          micStream: localAudioStreamRef.current!,
          micId: localAudioDeviceId || "",
          screenShareStream: captureStream,
          screenShareId: captureStream.id,
          screenAudioContent: captureStream,
          screenAudioId: captureStream.id,
        })
      }

      localScreenShareStreamRef.current = captureStream
      setScreenShareActive(true)
      toast.success("Screen share started", { id: "SCREENSHARE_STATUS" })
    }
  }

  const toggleScreenSharing = async (): Promise<void> => {
    if (screenShareActive) {
      await stopScreenSharing()
    } else {
      await startScreenSharing()
    }
  }

  const addLayerToRef = (layer: Layer): void => {
    if (findLayerIndex(layer) > -1) return
    layersRef.current.push(layer)
  }

  const findLayerIndex = (layer: Layer): number => {
    return layersRef.current.findIndex((savedLayer) => savedLayer.name === layer.name)
  }

  const updateLayer = (layer: Layer): void => {
    const layerIndex = findLayerIndex(layer)
    if (layerIndex !== -1) {
      layersRef.current[layerIndex] = layer
    }
  }

  const layerExists = (layerName: string): boolean => {
    if (!broadcastClientRef.current) return false

    const exists = broadcastClientRef.current.getVideoInputDevice(layerName) ? true : false
    return exists
  }

  const removeLayerFromRef = (layerName: string): void => {
    const filteredLayers = layersRef.current.filter((layer) => {
      return layer.name !== layerName // Fixed the comparison here
    })
    layersRef.current = filteredLayers
  }

  const loadImage = async (img: HTMLImageElement): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      img.onload = async () => {
        resolve(true)
      }
      img.onerror = async () => {
        reject(false)
      }
    })
  }

  const addImageLayer = async ({ imageSrc, name, position, visible }: AddImageLayerParams): Promise<void> => {
    if (!broadcastClientRef.current) return

    if (layerExists(name)) await removeImageLayer({ name })

    const img = new Image()
    img.crossOrigin = "anonymous" // Add this to avoid CORS issues
    img.src = `${imageSrc}`
    await loadImage(img)

    try {
      await broadcastClientRef.current.addImageSource(img, name, position)
      if (!visible) {
        const addedDevice = await broadcastClientRef.current.getVideoInputDevice(name)
        if (addedDevice) {
          addedDevice.render = false
        }
      }
      addLayerToRef({ name, type: "image", visible })
    } catch (err) {
      console.error(err)
    }
  }

  const addVideoLayer = async ({ videoElem, name, position, visible }: AddVideoLayerParams): Promise<void> => {
    if (!broadcastClientRef.current) return

    if (layerExists(name)) await removeImageLayer({ name })

    try {
      await broadcastClientRef.current.addImageSource(videoElem, name, position)
      if (!visible) {
        const addedDevice = await broadcastClientRef.current.getVideoInputDevice(name)
        if (addedDevice) {
          addedDevice.render = false
        }
      }
      addLayerToRef({ name, type: "video", visible })
    } catch (err) {
      console.error(err)
    }
  }

  const removeImageLayer = async ({ name }: RemoveLayerParams): Promise<void> => {
    if (!broadcastClientRef.current || !IVSBroadcastClientRef.current) return

    try {
      await broadcastClientRef.current.removeImage(name)
      removeLayerFromRef(name)
    } catch (err: any) {
      if (err.code === IVSBroadcastClientRef.current.Errors.REMOVE_IMAGE_NOT_FOUND_ERROR.code) {
        removeLayerFromRef(name)
        console.info("Layer not found:", name)
      } else {
        console.error(err)
      }
    }
  }

  const addOrUpdateDeviceLayer = async ({
    deviceStream,
    name,
    position,
    visible,
  }: AddDeviceLayerParams): Promise<void> => {
    if (layerExists(name)) {
      await updateDeviceLayer({ name, position, visible })
    } else {
      await addDeviceLayer({ deviceStream, name, position, visible })
    }
  }

  const addDeviceLayer = async ({ deviceStream, name, position, visible }: AddDeviceLayerParams): Promise<void> => {
    if (!broadcastClientRef.current) return

    try {
      await broadcastClientRef.current.addVideoInputDevice(deviceStream, name, position)

      addLayerToRef({ name, type: "device", visible })
    } catch (err) {
      console.error(err)
    }
  }

  const updateDeviceLayer = async ({ name, position, visible }: UpdateDeviceLayerParams): Promise<void> => {
    if (!broadcastClientRef.current) return

    await broadcastClientRef.current.updateVideoDeviceComposition(name, position)
    updateLayer({ name, type: "device", visible })
  }

  const removeDeviceLayer = async ({ name }: RemoveLayerParams): Promise<void> => {
    if (!broadcastClientRef.current || !IVSBroadcastClientRef.current) return

    try {
      await broadcastClientRef.current.removeVideoInputDevice(name)
      removeLayerFromRef(name)
    } catch (err: any) {
      if (err.code === IVSBroadcastClientRef.current.Errors.REMOVE_DEVICE_NOT_FOUND_ERROR.code) {
        removeLayerFromRef(name)
        console.info("Layer not found:", name)
      } else {
        console.error(err)
      }
    }
  }

  const addLayerFromSlot = async ({ type, content, name, position, visible }: AddLayerParams): Promise<void> => {
    switch (type) {
      case "device":
        await addOrUpdateDeviceLayer({
          deviceStream: content,
          name,
          position,
          visible,
        })
        break
      case "video":
        await addVideoLayer({ videoElem: content, name, position, visible })
        break
      case "image":
        await addImageLayer({ imageSrc: content, name, position, visible })
        break
      default:
        break
    }
  }

  const addSlots = async (slots: Slot[]): Promise<void> => {
    if (!broadcastClientRef.current) return

    // For each slot in the template, add an image or video layer at the location described by the slots
    const promises: Promise<void>[] = []

    for (const slot of slots) {
      const { name, type, dimensions, visible, content, resize } = slot
      const baseCanvasSize = broadcastClientRef.current.getCanvasDimensions()

      let calculatedDimensions = dimensions
      if (resize) {
        if (resize.mode === "FILL") {
          const { width, height } = resize.naturalSize
          calculatedDimensions = calcScaledCoords(width, height, baseCanvasSize.width, baseCanvasSize.height)
          calculatedDimensions.z = dimensions.z
        }
      }

      const position = formatPositionFromDimensions({
        dimensions: calculatedDimensions,
        baseCanvasSize,
      })

      promises.push(addLayerFromSlot({ type, content, name, position, visible }))
    }

    await Promise.allSettled(promises)
  }

  const setSceneFromTemplate = async (template: Template): Promise<void> => {
    const { mixer, slots } = template

    // If there is a current scene, remove layers that are disappearing
    if (activeSceneRef.current) {
      await removeOldLayers(activeSceneRef.current.slots, slots)
      await removeOldDevices(mixerDevicesRef.current, mixer)
    }

    await addSlots(slots)
    await addMixerDevices(mixer)
    activeSceneRef.current = template
  }

  const removeOldLayers = async (oldScene: Slot[], newScene: Slot[]): Promise<void> => {
    const newSlotNames = newScene.map((slot) => {
      const { name, type } = slot
      return { name, type }
    })
    const oldSlotNames = oldScene.map((slot) => {
      const { name, type } = slot
      return { name, type }
    })

    // Remove layers that are not in the updated scene
    const layersToRemove = oldSlotNames.filter((oldSlot) => {
      return newSlotNames.findIndex((newSlot) => newSlot.name === oldSlot.name) === -1
    })

    await removeAllLayers(layersToRemove as Layer[])
  }

  const refreshCurrentScene = async (newProps: any): Promise<void> => {
    if (!activeSceneRef.current) return

    const { update } = activeSceneRef.current
    const updatedScene = update(newProps)
    await setSceneFromTemplate(updatedScene)
  }

  const removeAllLayers = async (layers: Layer[] = layersRef.current): Promise<void> => {
    const promises: Promise<void>[] = []

    for (const layer of layers) {
      if (layer === undefined) continue
      const { name, type } = layer
      switch (type) {
        case "device":
          promises.push(removeDeviceLayer({ name }))
          break
        case "video":
          promises.push(removeImageLayer({ name }))
          break
        case "image":
          promises.push(removeImageLayer({ name }))
          break
        default:
          break
      }
    }
    await Promise.allSettled(promises)
  }

  const showScreenShare = async ({
    cameraStream,
    cameraId,
    cameraVisible = true,
    cameraIsCanvas = false,
    showMuteIcon = micMuted,
    micStream,
    micId,
    screenShareStream,
    screenShareId,
    screenAudioContent,
    screenAudioId,
  }: ShowScreenShareParams): Promise<void> => {
    const screenShareScene = SCREENSHARE_TEMPLATE({
      cameraContent: cameraStream,
      cameraId: cameraId,
      cameraVisible: cameraVisible,
      cameraIsCanvas: cameraIsCanvas,
      screenShareContent: screenShareStream,
      screenShareId: screenShareId,
      cameraOffContent: "/assets/camera-off.png",
      showMuteIcon: showMuteIcon,
      micMutedContent: "/assets/mic-off.png",
      backgroundContent: "/assets/camera-bg.png",
      micContent: micStream,
      micId: micId,
      screenAudioContent: screenAudioContent,
      screenAudioId: screenAudioId,
    })
    await setSceneFromTemplate(screenShareScene)
    setScreenShareActive(true)
  }

  const showFullScreenCam = async ({
    cameraStream,
    cameraId,
    cameraVisible = true,
    cameraIsCanvas,
    micStream,
    micId,
    showMuteIcon = micMuted,
  }: ShowFullScreenCamParams): Promise<void> => {
    let cameraResize: ResizeConfig | undefined = undefined

    if (!cameraIsCanvas && cameraStream instanceof MediaStream) {
      const videoTrack = cameraStream.getVideoTracks()[0]
      if (videoTrack) {
        const { width, height } = videoTrack.getSettings()
        if (width && height) {
          cameraResize = {
            mode: "FILL",
            naturalSize: { width, height },
          }
        }
      }
    }

    // TODO: check type assertion safety
    const fullScreenCam = DEFAULT_TEMPLATE({
      cameraContent: cameraStream!,
      cameraId: cameraId!,
      cameraVisible: cameraVisible,
      cameraIsCanvas: cameraIsCanvas,
      cameraResize: cameraResize,
      cameraOffContent: "/assets/camera-off.png",
      showMuteIcon: showMuteIcon,
      micMutedContent: "/assets/mic-off.png",
      backgroundContent: "/assets/camera-bg.png",
      micContent: micStream!,
      micId: micId!,
    })
    await setSceneFromTemplate(fullScreenCam)
    setScreenShareActive(false)
  }

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
}

export default useBroadcastLayout
export type {
  UseBroadcastLayoutReturn,
  Layer,
  Position,
  Dimensions,
  Slot,
  Template,
  ShowScreenShareParams,
  ShowFullScreenCamParams,
}

