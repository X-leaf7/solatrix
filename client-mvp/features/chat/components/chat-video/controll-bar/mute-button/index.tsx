"use client"

import type React from "react"
import { MicrophoneIcon } from "@heroicons/react/24/solid"
import MicrophoneSlashIcon from "./MicrophoneSlashIcon"
import { Button, Icon } from "@/shared/dsm"
import styles from "../controlbar.module.sass"

interface MuteButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  muted: boolean
  handleMicMute: () => void
}

export function MuteButton({ muted, handleMicMute, ...additionalProps }: MuteButtonProps) {
  const buttonStyle = muted ? "danger" : "primary"

  return (
    <Button intent={buttonStyle} size="medium" onClick={handleMicMute} {...additionalProps}>
      {!muted ? (
        <Icon>
          <MicrophoneIcon className={styles.icon} />
        </Icon>
      ) : (
        <Icon>
          <MicrophoneSlashIcon />
        </Icon>
      )}
    </Button>
  )
}

