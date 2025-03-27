'use client'

import React, { useContext, useEffect, useState } from 'react'
import { HandRaisedIcon } from '@heroicons/react/24/outline'

import { Icon } from '@/dsm'
import {
  LocalMediaContext,
  UserSettingsContext,
  BroadcastLayoutContext
} from '@/providers'

import styles from './preview.module.sass'

interface IStreamPreviewProps {
  previewRef: React.MutableRefObject<HTMLCanvasElement | null>
}

const StreamPreview: React.FC<IStreamPreviewProps> = ({ previewRef }) => {
  const { permissions } = useContext(LocalMediaContext)
  const { screenShareActive, camActive } = useContext(BroadcastLayoutContext)
  const { localVideoMirror } = useContext(UserSettingsContext)

  const [mounted, setMounted] = useState(false)

  const shouldMirrorPreview: boolean = camActive && !screenShareActive && !!localVideoMirror && mounted

  const mirrorClass = shouldMirrorPreview
    ? `${styles.canvasContainer} ${styles.canvasContainerMirrored}`
    : styles.canvasContainer

  useEffect(() => {
    setMounted(true)

    return (() => {
      setMounted(false)
    })
  }, [mounted])

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <div className={styles.canvasWrapper}>
          <div className={mirrorClass}>
            <canvas
              key="STREAM_PREVIEW_VIDEO"
              id="cam-video-preview"
              className={styles.canvas}
              ref={previewRef}
            ></canvas>
          </div>
          {!permissions && (
            <div className={styles.permissionsOverlay}>
              <div className={styles.permissionsMessage}>
                <Icon size="lg">
                  <HandRaisedIcon className={styles.icon} />
                </Icon>
                <span className={styles.text}>To start streaming, allow access to your camera and microphone</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StreamPreview
