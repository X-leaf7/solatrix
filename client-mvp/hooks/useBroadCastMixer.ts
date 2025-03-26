"use client"

import type React from "react"
import { useContext, useEffect, useRef, useState } from "react"

import { BroadcastContext } from "@/providers/BroadCastContext"

// Define interfaces for the mixer devices
interface MixerDevice {
  audioStream: MediaStream
  deviceName: string
}

// Define the return type for the hook
interface UseBroadcastMixerReturn {
  micMuted: boolean
  setMicMuted: React.Dispatch<React.SetStateAction<boolean>>
  addMixerDevice: (device: MixerDevice) => Promise<void>
  addMixerDevices: (devices: MixerDevice[]) => Promise<void>
  removeMixerDevice: (deviceName: string) => Promise<void>
  removeOldDevices: (oldDevices?: MixerDevice[], newDevices?: MixerDevice[]) => Promise<void>
  refreshMixer: (devices: MixerDevice[]) => Promise<void>
  getMixerDevice: (deviceName: string) => MixerDevice | undefined
  mixerDevicesRef: React.MutableRefObject<MixerDevice[]>
  toggleMute: (deviceName: string) => void
}

// Define interface for the broadcast client
interface BroadcastClient {
  addAudioInputDevice: (audioStream: MediaStream, deviceName: string) => Promise<void>
  removeAudioInputDevice: (deviceName: string) => Promise<void>
  getAudioInputDevice: (deviceName: string) => MediaStream | null
  getVideoInputDevice: (deviceName: string) => any
}

// Define interface for the IVS broadcast client ref
interface IVSBroadcastClient {
  Errors: {
    REMOVE_DEVICE_NOT_FOUND_ERROR: {
      code: number
    }
    [key: string]: any
  }
  [key: string]: any
}

const useBroadcastMixer = (): UseBroadcastMixerReturn => {
  const { broadcastClientRef, IVSBroadcastClientRef } = useContext(BroadcastContext)
  const [micMuted, setMicMuted] = useState<boolean>(false)
  const mixerRef = useRef<MixerDevice[]>([])

  const deviceExists = (deviceName: string): boolean => {
    if (!broadcastClientRef.current) return false

    const client = broadcastClientRef.current as unknown as BroadcastClient
    const exists = client.getAudioInputDevice(deviceName) ? true : false
    return exists
  }

  const addMixerDevices = async (devices: MixerDevice[]): Promise<void> => {
    const promises: Promise<void>[] = []

    for (const { audioStream, deviceName } of devices) {
      promises.push(addMixerDevice({ audioStream, deviceName }))
    }
    await Promise.allSettled(promises)
  }

  const removeAllDevices = async (devices: MixerDevice[] = mixerRef.current): Promise<void> => {
    const promises: Promise<void>[] = []

    for (const { deviceName } of devices) {
      promises.push(removeMixerDevice(deviceName))
    }
    await Promise.allSettled(promises)
  }

  const removeOldDevices = async (
    oldDevices: MixerDevice[] = mixerRef.current,
    newDevices: MixerDevice[] = [],
  ): Promise<void> => {
    // Remove devices that are not in the updated mixer
    const devicesToRemove = oldDevices.filter((oldDevice) => {
      return newDevices.findIndex((newDevice) => newDevice.deviceName === oldDevice.deviceName) === -1
    })
    await removeAllDevices(devicesToRemove)
  }

  const refreshMixer = async (devices: MixerDevice[]): Promise<void> => {
    await removeOldDevices(mixerRef.current, devices)

    const promises: Promise<void>[] = []

    for (const device of devices) {
      const { audioStream, deviceName } = device
      promises.push(addMixerDevice({ audioStream, deviceName }))
    }

    await Promise.allSettled(promises)
  }

  const removeDeviceFromRef = (deviceName: string): void => {
    const filteredMixer = mixerRef.current.filter((_device) => {
      return _device.deviceName !== deviceName // Fixed the comparison here
    })
    mixerRef.current = filteredMixer
  }

  const addMixerDevice = async ({ audioStream, deviceName }: MixerDevice): Promise<void> => {
    if (deviceExists(deviceName)) {
      return
    }
    try {
      if (!broadcastClientRef.current) return

      const client = broadcastClientRef.current as unknown as BroadcastClient
      await client.addAudioInputDevice(audioStream, deviceName)
      mixerRef.current.push({ audioStream, deviceName })
    } catch (err) {
      console.error(err)
    }
  }

  const removeMixerDevice = async (deviceName: string): Promise<void> => {
    try {
      if (!broadcastClientRef.current || !IVSBroadcastClientRef.current) return

      const client = broadcastClientRef.current as unknown as BroadcastClient
      const ivsClient = IVSBroadcastClientRef.current as unknown as IVSBroadcastClient

      await client.removeAudioInputDevice(deviceName)
      removeDeviceFromRef(deviceName)
    } catch (err: any) {
      if (
        IVSBroadcastClientRef.current &&
        err.code ===
          (IVSBroadcastClientRef.current as unknown as IVSBroadcastClient).Errors.REMOVE_DEVICE_NOT_FOUND_ERROR.code
      ) {
        removeDeviceFromRef(deviceName)
        console.info("Device not found:", deviceName)
      } else {
        console.error(err)
      }
    }
  }

  const getMixerDevice = (deviceName: string): MixerDevice | undefined => {
    const device = mixerRef.current.find((device) => device.deviceName === deviceName)
    return device
  }

  const toggleMute = (deviceName: string): void => {
    if (!broadcastClientRef.current) return

    const client = broadcastClientRef.current as unknown as BroadcastClient
    const audioDevice = client.getAudioInputDevice(deviceName)

    if (!audioDevice) return

    const audioTrack = audioDevice.getAudioTracks()[0]
    if (!audioTrack) return

    setMicMuted((prevState) => {
      audioTrack.enabled = prevState
      // toast.success(`${prevState ? 'Mic unmuted' : 'Mic muted'}`, {
      //   id: 'MIC_STATUS',
      // });
      return !prevState
    })
  }

  useEffect(() => {
    if (!broadcastClientRef.current) return

    const client = broadcastClientRef.current as unknown as BroadcastClient
    const muteIcon = client.getVideoInputDevice("micMutedIcon")

    if (muteIcon) {
      muteIcon.render = micMuted
    }
  }, [micMuted, broadcastClientRef])

  return {
    micMuted,
    setMicMuted,
    addMixerDevice,
    addMixerDevices,
    removeMixerDevice,
    removeOldDevices,
    refreshMixer,
    getMixerDevice,
    mixerDevicesRef: mixerRef,
    toggleMute,
  }
}

export default useBroadcastMixer
export type { MixerDevice, UseBroadcastMixerReturn }

