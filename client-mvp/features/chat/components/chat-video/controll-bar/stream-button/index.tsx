"use client"

import type React from "react"
import { SignalIcon } from "@heroicons/react/20/solid"
import { Button, Icon } from "@/shared/dsm"
import styles from "../controlbar.module.sass"

interface StreamButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLive: boolean
  handleStream: () => Promise<void>
  loading?: boolean
  disabled?: boolean
}

export function StreamButton({
  isLive,
  handleStream,
  loading,
  disabled,
  ...additionalProps
}: StreamButtonProps) {
  const buttonStyle = isLive ? "danger" : "primary"
  const buttonContent = isLive ? "Stop streaming" : "Start streaming"

  return (
    <Button
      intent={buttonStyle}
      size="medium"
      onClick={handleStream}
      disabled={disabled}
      loading={loading}
      {...additionalProps}
    >
      <span className={styles.desktopText}>{buttonContent}</span>
      <span className={styles.mobileIcon}>
        <Icon>
          <SignalIcon className={styles.icon} />
        </Icon>
      </span>
    </Button>
  )
}

