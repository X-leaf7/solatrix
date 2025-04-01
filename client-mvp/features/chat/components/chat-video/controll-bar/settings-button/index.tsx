"use client"

import type React from "react"
import { Cog6ToothIcon } from "@heroicons/react/24/solid"
import { Button, Icon } from "@/shared/dsm"
import styles from "../controlbar.module.sass"
import { useEffect, useState } from "react"

interface SettingsButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  handleSettings: () => void
}

export function SettingsButton({ handleSettings, ...additionalProps }: SettingsButtonProps) {
  const [isClient, setIsClient] = useState(false)
  
    useEffect(() => {
      setIsClient(true)
    }, [])
  
    if (!isClient) {
      return null
    }

  return (
    <Button intent="primary" size="medium" onClick={handleSettings} {...additionalProps}>
      <Icon>
        <Cog6ToothIcon className={styles.icon} />
      </Icon>
    </Button>
  )
}

