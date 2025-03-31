"use client"

import type React from "react"
import { Button, Icon } from "@/shared/dsm"
import styles from "../controlbar.module.sass"
import { useEffect, useState } from "react"

// Define custom icon components if they're not imported from a library
function ScreenShareIcon(): React.ReactElement {
  return (
    <svg
      className={styles.icon}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 3H15M12 3V21M12 21H17M12 21H7M22 15H17M17 15V21M17 15L21 11M2 15H7M7 15V21M7 15L3 11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ScreenShareSlashIcon(): React.ReactElement {
  return (
    <svg
      className={styles.icon}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 7L6 19M9 3H15M12 3V21M12 21H17M12 21H7M22 15H17M17 15V21M17 15L21 11M2 15H7M7 15V21M7 15L3 11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

interface ScreenShareButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active: boolean
  handleScreenShare: () => Promise<void>
}

export function ScreenShareButton({
  active,
  handleScreenShare,
  ...additionalProps
}: ScreenShareButtonProps) {
  const buttonStyle = active ? "secondary" : "primary"

  const [isClient, setIsClient] = useState(false)
  
    useEffect(() => {
      setIsClient(true)
    }, [])
  
    if (!isClient) {
      return null
    }

  return (
    <Button intent={buttonStyle} size="medium" onClick={handleScreenShare} {...additionalProps}>
      <Icon>{active ? <ScreenShareSlashIcon /> : <ScreenShareIcon />}</Icon>
    </Button>
  )
}

