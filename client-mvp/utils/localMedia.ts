// From https://codepen.io/amazon-ivs/project/editor/ZzWobn
// From https://gitlab.aws.dev/ivs-demos/amazon-ivs-real-time-tool/-/blob/main/src/contexts/DeviceManager/helpers/helpers.ts

import toast from "react-hot-toast"

// Define types for permissions and mediaDevices
let permissions: Permissions | undefined
let mediaDevices: MediaDevices | undefined

if (typeof window !== "undefined") {
  permissions = navigator.permissions
  mediaDevices = navigator.mediaDevices
}

// Define interfaces for function parameters and return values
interface DeviceOptions {
  savedAudioDeviceId?: string
  savedVideoDeviceId?: string
}

interface DeviceList {
  videoDevices: MediaDeviceInfo[]
  audioDevices: MediaDeviceInfo[]
}

interface PermissionResult {
  permissions: boolean
  mediaStream?: MediaStream
  error?: Error
}

interface AvailableDevices extends DeviceList {
  permissions: boolean
}

interface CameraStreamOptions {
  deviceId?: string
  width?: number
  height?: number
  facingMode?: string
  frameRate?: number
  aspectRatio?: number
}

interface MediaDevice {
  value: string
  label: string
}

interface PromiseSettledResult<T> {
  status: "fulfilled" | "rejected"
  value?: T
  reason?: any
}

// Add these custom interface definitions after the existing interfaces and before the functions

// Extended interface for display media constraints
interface DisplayMediaStreamConstraints {
  video?: boolean | DisplayMediaTrackConstraints
  audio?: boolean | MediaTrackConstraints
}

// Custom interface for display media track constraints
interface DisplayMediaTrackConstraints extends MediaTrackConstraints {
  cursor?: "always" | "motion" | "never"
  resizeMode?: "none" | "crop-and-scale"
  displaySurface?: "application" | "browser" | "monitor" | "window"
}

function checkMediaDevicesSupport(): void {
  if (!mediaDevices) {
    throw new Error("Media device permissions can only be requested in a secure context (i.e. HTTPS).")
  }
}

function isFulfilled<T>(input: PromiseSettledResult<T>): input is { status: "fulfilled"; value: T } {
  return input.status === "fulfilled"
}

function isRejected<T>(input: PromiseSettledResult<T>): input is { status: "rejected"; reason: any } {
  return input.status === "rejected"
}

async function enumerateDevices(): Promise<DeviceList> {
  const devices = await navigator.mediaDevices.enumerateDevices()
  const videoDevices = devices.filter((d) => d.kind === "videoinput")
  if (!videoDevices.length) {
    toast.error("Error: Could not find any webcams.", {
      id: "err-could-not-list-video-devices",
      duration: Number.POSITIVE_INFINITY,
    })
  }

  const audioDevices = devices.filter((d) => d.kind === "audioinput")
  if (!audioDevices.length) {
    toast.error("Error: Could not find any microphones.", {
      id: "err-could-not-list-audio-devices",
      duration: Number.POSITIVE_INFINITY,
    })
  }

  return {
    videoDevices,
    audioDevices,
  }
}

async function getPermissions({ savedAudioDeviceId, savedVideoDeviceId }: DeviceOptions): Promise<PermissionResult> {
  let error: Error | undefined
  let mediaStream: MediaStream | undefined
  let arePermissionsGranted = false

  try {
    checkMediaDevicesSupport()

    const [cameraPermissionQueryResult, microphonePermissionQueryResult] = await Promise.allSettled(
      ["camera", "microphone"].map((permissionDescriptorName) =>
        permissions!.query({
          name: permissionDescriptorName as PermissionName,
        }),
      ),
    )

    const constraints: MediaStreamConstraints = {}

    if (
      (isFulfilled(cameraPermissionQueryResult) && cameraPermissionQueryResult.value.state !== "granted") ||
      isRejected(cameraPermissionQueryResult)
    ) {
      constraints.video = {
        deviceId: { ideal: savedVideoDeviceId },
      }
    }

    if (
      (isFulfilled(microphonePermissionQueryResult) && microphonePermissionQueryResult.value.state !== "granted") ||
      isRejected(microphonePermissionQueryResult)
    ) {
      constraints.audio = {
        deviceId: { ideal: savedAudioDeviceId },
      }
    }

    if (Object.keys(constraints).length) {
      mediaStream = await mediaDevices!.getUserMedia(constraints)
    }

    arePermissionsGranted = true
  } catch (err: any) {
    error = new Error(err.name)
  }
  return { permissions: arePermissionsGranted, mediaStream, error }
}

async function getAvailableDevices({
  savedAudioDeviceId,
  savedVideoDeviceId,
}: DeviceOptions): Promise<AvailableDevices> {
  // The following line prevents issues on Safari/FF WRT to device selects
  // and ensures the device labels are not blank
  const {
    permissions: permissionsGranted,
    mediaStream,
    error,
  } = await getPermissions({
    savedAudioDeviceId,
    savedVideoDeviceId,
  })

  if (!permissionsGranted || error) {
    toast.error(
      "Error: Could not access webcams or microphones. Allow this app to access your webcams and microphones and refresh the app.",
      {
        id: "err-permission-denied",
        duration: Number.POSITIVE_INFINITY,
      },
    )
  }

  const { videoDevices, audioDevices } = await enumerateDevices()

  // After enumerating devices, the initial mediaStream must be stopped
  if (mediaStream) await stopMediaStream(mediaStream)

  return {
    videoDevices,
    audioDevices,
    permissions: permissionsGranted,
  }
}

async function stopMediaStream(mediaStream: MediaStream): Promise<void> {
  for (const track of mediaStream.getTracks()) {
    track.stop()
  }
}

async function getCameraStream({
  deviceId,
  width,
  height,
  facingMode,
  frameRate,
  aspectRatio,
}: CameraStreamOptions): Promise<MediaStream | undefined> {
  let cameraStream: MediaStream | undefined = undefined
  const constraints: MediaStreamConstraints = {
    video: {
      deviceId: deviceId ? { exact: deviceId } : undefined,
      width: {
        ideal: width,
      },
      height: {
        ideal: height,
      },
      facingMode: { ideal: facingMode },
      frameRate: { ideal: frameRate },
      aspectRatio: { ideal: aspectRatio },
    },
    audio: false,
  }
  try {
    const media = await navigator.mediaDevices.getUserMedia(constraints)
    cameraStream = media
  } catch (err: any) {
    console.error("Could not get camera stream:", err.message)
  }
  return cameraStream
}

async function getMicrophoneStream(deviceId = "default"): Promise<MediaStream | undefined> {
  let microphoneTrack: MediaStream | undefined = undefined
  try {
    const media = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: { deviceId: { exact: deviceId } },
    })
    microphoneTrack = media
  } catch (err: any) {
    console.error("Could not get microphone stream:", err.message)
  }
  return microphoneTrack
}

// Update the getScreenshareStream function to use the custom interfaces
async function getScreenshareStream(): Promise<MediaStream> {
  let captureStream: MediaStream | undefined = undefined
  try {
    captureStream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        cursor: "always",
        frameRate: 30,
        resizeMode: "crop-and-scale",
      } as DisplayMediaTrackConstraints,
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
      },
    } as DisplayMediaStreamConstraints)
  } catch (err: any) {
    throw new Error(err)
  }
  return captureStream!
}

function getIdealDevice(deviceId: string | undefined, devices: MediaDevice[]): string | undefined {
  if (!devices || devices.length === 0) return undefined
  const deviceExists = devices.reduce(
    (foundDevice, currentDevice) => foundDevice || currentDevice.value == deviceId,
    false,
  )
  return deviceExists ? deviceId : devices[0].value
}

function getDisconnectedDevices(oldDeviceArr: MediaDevice[], newDeviceArr: MediaDevice[]): MediaDevice[] {
  return oldDeviceArr.filter(
    (oldDevice) => newDeviceArr.findIndex((newDevice) => newDevice.value === oldDevice.value) === -1,
  )
}

function getConnectedDevices(oldDeviceArr: MediaDevice[], newDeviceArr: MediaDevice[]): MediaDevice[] {
  return newDeviceArr.filter(
    (newDevice) => oldDeviceArr.findIndex((oldDevice) => oldDevice.value === newDevice.value) === -1,
  )
}

export {
  getAvailableDevices,
  getCameraStream,
  getMicrophoneStream,
  getScreenshareStream,
  stopMediaStream,
  getIdealDevice,
  getDisconnectedDevices,
  getConnectedDevices,
}

