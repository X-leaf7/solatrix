"use client"

import type React from "react"

import { useState, type FormEvent } from "react"
import { Button, Input } from "@/shared/dsm"

import styles from "./styles.module.sass"

import { useChatContext } from "@/shared/providers"

export function FormChatEvent() {
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { sendMessage } = useChatContext()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Don't send empty messages (trim removes whitespace)
    if (!message.trim()) {
      return
    }

    try {
      setIsSubmitting(true)

      // Send the message using the context function
      sendMessage(message)

      // Clear the input after successful send
      setMessage("")
    } catch (error) {
      console.error("Failed to send message:", error)
      // You could add error handling UI here
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle keyboard shortcuts (e.g., Ctrl+Enter to send)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      handleSubmit(e)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
  }

  return (
    <form className={styles.base} onSubmit={handleSubmit}>
      <Input
        fullWidth
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        aria-label="Message input"
        disabled={isSubmitting}
      />
      <Button
        icon="paperPlane"
        type="submit"
        disabled={isSubmitting || !message.trim()}
        aria-label="Send message"
      />
    </form>
  )
}

