import type React from "react"
import "./styles.module.sass"

// Define the props interface with TypeScript
interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  type?: "base" | "inverted" | "success" | "error" | "warn"
  size?: "sm" | "md" | "lg" | "xl"
  children: React.ReactNode
}

export function Icon({ type = "base", size, children, className, ...additionalProps }: IconProps) {
  // Create the class name based on props
  const iconClass = `icon icon--${type}${size ? ` icon--${size}` : ""}${className ? ` ${className}` : ""}`

  return (
    <span className={iconClass} {...additionalProps}>
      {children}
    </span>
  )
}

