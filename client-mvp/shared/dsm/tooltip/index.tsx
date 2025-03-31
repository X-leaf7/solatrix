"use client"

import { useState, useRef, useEffect, type ReactNode } from "react"
import styles from "./tooltip.module.sass"
import clsx from "clsx"

interface TooltipProps {
  children: ReactNode
  content: string
  hAlign?: "left" | "center" | "right"
  vAlign?: "top" | "bottom"
  persist?: boolean
  delay?: number
}

export function Tooltip({
  children,
  content,
  hAlign = "center",
  vAlign = "top",
  persist = false,
  delay = 300,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const tooltipClass = clsx(
    styles.tooltip,
    isVisible && styles.visible,
    styles[`hAlign${hAlign.charAt(0).toUpperCase() + hAlign.slice(1)}`],
    styles[`vAlign${vAlign.charAt(0).toUpperCase() + vAlign.slice(1)}`],
  )

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
    }, delay)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (!persist) {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false)
      }, 100)
    }
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <div
      className={styles.container}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}
      <div className={tooltipClass}>
        <div className={styles.content}>{content}</div>
      </div>
    </div>
  )
}

