'use client'

import type React from "react"
import { isDesktop } from "react-device-detect"
import { useContext, useCallback, useEffect, useState } from "react"

import { Button, Icon, Tooltip } from "@/dsm"

import styles from "./controlbar.module.sass"
import { MuteButton } from "./mute-button"
import { CamButton } from "./cam-button"
import { ScreenShareButton } from "./screenshare-button"
import { SettingsButton } from "./settings-button"
import { StreamButton } from "./stream-button"
// import About from "@/components/about"
import Settings from "@/components/settings/Settings"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import {
  BroadcastContext,
  BroadcastLayoutContext,
  LocalMediaContext,
  BroadcastMixerContext,
  ModalContext
} from "@/shared/providers"

// Define context interfaces
// interface BroadcastContextType {
//   isLive: boolean
//   streamPending: boolean
//   toggleStream: () => Promise<void>
//   sdkVersionRef: React.MutableRefObject<string | undefined>
//   broadcastClientRef: React.MutableRefObject<any>
// }

// interface BroadcastLayoutContextType {
//   camActive: boolean
//   screenShareActive: boolean
//   toggleCamVisiblity: (cameraId: string) => void
//   toggleScreenSharing: (cam?: any) => Promise<void>
// }

// interface BroadcastMixerContextType {
//   micMuted: boolean
//   toggleMute: (deviceId?: string) => void
// }

// interface LocalMediaContextType {
//   permissions: boolean
//   localVideoDeviceId?: string
//   localAudioDeviceId?: string
// }

// interface ModalContextType {
//   toggleModal: () => void
//   setModalProps: (props: any) => void
//   setModalContent: (content: React.ReactNode) => void
// }

export default function ControlBar() {

  const [isClient, setIsClient] = useState(false)
  
    useEffect(() => {
      setIsClient(true)
    }, [])
  
  const { isLive, streamPending, toggleStream, sdkVersionRef, broadcastClientRef } = useContext(
    BroadcastContext,
  )

  const { camActive, screenShareActive, toggleCamVisiblity, toggleScreenSharing } = useContext(
    BroadcastLayoutContext,
  )

  const { micMuted, toggleMute } = useContext(BroadcastMixerContext)

  const { permissions, localVideoDeviceId, localAudioDeviceId } = useContext(
    LocalMediaContext,
  )

  const { toggleModal, setModalProps, setModalContent } = useContext(ModalContext)

  const handleMicMute = useCallback(() => {
    console.log('handle mute button clicked')
    toggleMute(localAudioDeviceId!)
  }, [localAudioDeviceId, toggleMute])

  const handleCameraMute = useCallback(() => {
    if (localVideoDeviceId) {
      toggleCamVisiblity(localVideoDeviceId)
    }
  }, [localVideoDeviceId, toggleCamVisiblity])

  const handleScreenShare = useCallback(async () => {
    if (broadcastClientRef.current && localVideoDeviceId) {
      // const cam = broadcastClientRef.current.getVideoInputDevice(localVideoDeviceId).source
      toggleScreenSharing()
    }
  }, [localVideoDeviceId, toggleScreenSharing, broadcastClientRef])

  const handleSettings = useCallback(() => {
    setModalProps({
      type: "full",
    })
    setModalContent(<Settings />)
    toggleModal()
  }, [toggleModal, setModalProps, setModalContent])

  const handleAboutClick = useCallback(() => {
    console.log('button clicked')
    setModalProps({
      type: "default",
    })
    // setModalContent(<About version={sdkVersionRef.current} handleModalClose={toggleModal} />)
    toggleModal()
  }, [toggleModal, setModalProps, setModalContent, sdkVersionRef])

  if (!isClient) {
    return null
  }

  return (
    <div className={styles.controlBar}>
      {/* Left bar */}
      <div className={styles.leftBar}></div>

      {/* Center bar */}
      <div className={styles.centerBar}>
        <div className={styles.buttonGroup}>
          <Tooltip content={`${micMuted ? "Unmute" : "Mute"}`}>
            <MuteButton muted={micMuted} handleMicMute={handleMicMute} disabled={!permissions} />
          </Tooltip>

          <Tooltip content={`${camActive ? "Hide camera" : "Show camera"}`}>
            <CamButton muted={!camActive} handleCameraMute={handleCameraMute} disabled={!permissions} />
          </Tooltip>

          {isDesktop && (
            <Tooltip content={`${screenShareActive ? "Stop sharing" : "Share your screen"}`}>
              <ScreenShareButton
                active={screenShareActive}
                handleScreenShare={handleScreenShare}
                disabled={!permissions}
              />
            </Tooltip>
          )}

          <Tooltip content="Open settings">
            <SettingsButton handleSettings={handleSettings} disabled={!permissions} />
          </Tooltip>

          <div className={styles.mobileInfoButton}>
            <Tooltip content="About this tool">
              <Button intent="primary" size="medium" onClick={handleAboutClick}>
                <Icon>
                  <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24.15 34q.65 0 1.075-.425.425-.425.425-1.075v-9.05q0-.6-.45-1.025Q24.75 22 24.15 22q-.65 0-1.075.425-.425.425-.425 1.075v9.05q0 .6.45 1.025.45.425 1.05.425ZM24 18.3q.7 0 1.175-.45.475-.45.475-1.15t-.475-1.2Q24.7 15 24 15q-.7 0-1.175.5-.475.5-.475 1.2t.475 1.15q.475.45 1.175.45ZM24 44q-4.25 0-7.9-1.525-3.65-1.525-6.35-4.225-2.7-2.7-4.225-6.35Q4 28.25 4 24q0-4.2 1.525-7.85Q7.05 12.5 9.75 9.8q2.7-2.7 6.35-4.25Q19.75 4 24 4q4.2 0 7.85 1.55Q35.5 7.1 38.2 9.8q2.7 2.7 4.25 6.35Q44 19.8 44 24q0 4.25-1.55 7.9-1.55 3.65-4.25 6.35-2.7 2.7-6.35 4.225Q28.2 44 24 44Zm0-20Zm0 17q7 0 12-5t5-12q0-7-5-12T24 7q-7 0-12 5T7 24q0 7 5 12t12 5Z" />
                  </svg>
                </Icon>
              </Button>
            </Tooltip>
          </div>

          <StreamButton
            isLive={isLive}
            handleStream={toggleStream}
            loading={streamPending}
            disabled={!permissions || streamPending}
          />
        </div>
      </div>
      
    </div>
  )
}

