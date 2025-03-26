"use client"

import type React from "react"
import { VideoCameraIcon } from "@heroicons/react/24/solid"
import { VideoCameraSlashIcon } from "@heroicons/react/24/outline"
import { Button, Icon } from "@/dsm"
import styles from "../controlbar.module.sass"
import { useEffect, useState } from "react"

interface CamButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  muted: boolean
  handleCameraMute: () => void
}

export function CamButton({ muted, handleCameraMute, ...additionalProps }: CamButtonProps) {
  const buttonStyle = muted ? "danger" : "primary"

  const [isClient, setIsClient] = useState(false)
  
    useEffect(() => {
      setIsClient(true)
    }, [])
  
    if (!isClient) {
      return null
    }

  return (
    <Button intent={buttonStyle} size="medium" onClick={handleCameraMute} {...additionalProps}>
      {!muted ? (
        <Icon>
          <VideoCameraIcon className={styles.icon} />
        </Icon>
      ) : (
        <Icon>
          <VideoCameraSlashIcon className={styles.icon} />
        </Icon>
      )}
    </Button>
  )
}

