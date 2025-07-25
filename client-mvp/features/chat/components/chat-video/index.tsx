'use client'

import React, { useContext, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  BroadcastContext,
  UserSettingsContext,
  BroadcastLayoutContext,
  LocalMediaContext
} from '@/shared/providers'

// import ControllBar from './controll-bar'
import StreamPreview from './stream-preview'
import styles from './video.module.sass'

export const ChatVideo = () => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const searchParams = useSearchParams()

  const {
    showFullScreenCam,
    refreshCurrentScene
  } = useContext(BroadcastLayoutContext)
  const {
    broadcastClientRef,
    createBroadcastClient,
    destroyBroadcastClient,
    broadcastClientMounted,
  } = useContext(BroadcastContext)
  const {
    configRef,
    setIngestEndpoint,
    setStreamKey,
    setChannelType
  } = useContext(UserSettingsContext)
  const {
    setInitialDevices,
    localVideoDeviceId,
    canvasElemRef,
    cleanUpDevices,
    enableCanvasCamera,
    refreshSceneRef,
    localVideoStreamRef
  } = useContext(LocalMediaContext)

  const previewRef = useRef<HTMLCanvasElement>(null)
  const sdkIsStarting = useRef(false)

  const [canvasWidth, setCanvasWidth] = useState()
  const [canvasHeight, setCanvasHeight] = useState()
  const [videoStream, setVideoStream] = useState<MediaStream | undefined>(undefined);

  useEffect(() => {
    if (sdkIsStarting.current) return

    sdkIsStarting.current = true

    setInitialDevices().then(
      ({ audioDeviceId, audioStream, videoDeviceId, videoStream }) => {
        
        if (!broadcastClientRef.current) {
          createBroadcastClient({
            config: configRef.current,
          }).then(() => {
            if (videoStream) {
              const { width, height } = videoStream.getTracks()[0].getSettings()
            }
            refreshSceneRef.current = refreshCurrentScene
            showFullScreenCam({
              cameraStream: enableCanvasCamera
                ? canvasElemRef.current
                : videoStream,
              cameraId: videoDeviceId,
              cameraIsCanvas: enableCanvasCamera,
              micStream: audioStream,
              micId: audioDeviceId,
              showMuteIcon: false,
            })
          })
        }
      }
    )

    return () => {
      if (broadcastClientRef.current) {
        destroyBroadcastClient(broadcastClientRef.current)
      }
      cleanUpDevices()
    }
  }, [
    broadcastClientRef,
    canvasElemRef,
    cleanUpDevices,
    configRef,
    createBroadcastClient,
    destroyBroadcastClient,
    enableCanvasCamera,
    refreshCurrentScene,
    setInitialDevices,
    refreshSceneRef,
    showFullScreenCam
  ])

  useEffect(() => {
    const uidQuery = searchParams.get('uid')
    const skQuery = searchParams.get('sk')
    const channelTypeQuery = searchParams.get('channelType')

    if (uidQuery && setIngestEndpoint) {
      setIngestEndpoint(`${uidQuery}.global-contribute.live-video.net`)
    }

    if (skQuery && setStreamKey) {
      setStreamKey(skQuery)
    }

    if (channelTypeQuery) {
      const formatted = channelTypeQuery.toUpperCase()

      switch (formatted) {
        case 'BASIC':
          if (setChannelType) {
            setChannelType('BASIC')
          }
          break
        case 'STANDARD':
          if (setChannelType) {
            setChannelType('STANDARD')
          }
          break
        default:
          console.error(
            `Channel type must be STANDARD, BASIC. The channel type you provided is ${channelTypeQuery}. The default value of BASIC has been set`
          )
          break
      }
    }

  }, [
    setChannelType,
    setIngestEndpoint,
    setStreamKey,
    searchParams
  ])

  useEffect(() => {
    if (broadcastClientMounted && broadcastClientRef.current) {
      console.log('attaching preview')
      broadcastClientRef.current.attachPreview(previewRef.current)
    }
    return () => {
      if (broadcastClientRef.current) {
        console.log('detaching preview')
        broadcastClientRef.current.detachPreview()
      }
    }
  }, [broadcastClientMounted, broadcastClientRef])

  useEffect(() => {
    if (!broadcastClientMounted || !enableCanvasCamera) return;
    if (broadcastClientRef.current) {
      const { width, height } = broadcastClientRef.current.getCanvasDimensions();
      setCanvasWidth(width);
      setCanvasHeight(height);
    }
    if (localVideoStreamRef.current) {
      setVideoStream(localVideoStreamRef.current);
    }
  }, [
    localVideoDeviceId,
    broadcastClientMounted,
    enableCanvasCamera,
    broadcastClientRef,
    localVideoStreamRef
  ]);

  if (!isClient) {
    return null
  }

  return (
    <div style={{ color: 'white' }} className={styles.container}>
      <StreamPreview previewRef={previewRef} />
      {/* <ControllBar /> */}
    </div>
  )
}
