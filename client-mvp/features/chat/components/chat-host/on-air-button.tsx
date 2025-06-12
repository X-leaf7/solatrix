"use client"

import type React from "react"
import styles from "./on-air-button.module.sass"
import { cva } from "cva"

interface OnAirButtonProps {
  isLive?: boolean
  className?: string
  onClick?: () => void
  loading?: boolean
  disabled?: boolean
}

const buttonStyles = cva(styles.base, {
  variants: {
    isLive: {
      true: styles.live,
      false: styles.offline,
    },
  },
  defaultVariants: {
    isLive: true,
  },
})

export const OnAirButton: React.FC<OnAirButtonProps> = ({
  isLive = true,
  className,
  onClick,
  loading = false,
  disabled = false,
}) => {
  return (
    <button className={buttonStyles({ isLive, className })} onClick={onClick} type="button" disabled={disabled}>
      <span className={styles.text}>ON AIR</span>
      {loading ? <span className={styles.loader}></span> : <span className={styles.indicator}></span>}
    </button>
  )
}
