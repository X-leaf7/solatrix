"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/shared/dsm"
import Image from "next/image"
import styles from "./styles.module.sass"

export const ChatCreate = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreateChat = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // TODO: update default name
      const defaultName = `Private Room ${new Date().toLocaleString()}`

      const response = await fetch("/api/chat/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: defaultName }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to create chat room")
      }

      const data = await response.json()

      router.push(`/chat/${data.id}/invite?code=${data.invitation_code}`)

    } catch (err) {
      console.error("Error creating chat room:", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }, [router])

  return (
    <section className={styles.base}>
      <figure className={styles.image}>
        <Image src="/images/illustration-error.png" width={120} height={120} alt="Error State" />
      </figure>
      <h2 className={styles.heading}>Create private chat?</h2>
      <div className={styles.box}>
        <div className={styles.fineprint}>
          <p>A private room with a unique link will be created with you as the host.</p>
          <p>You and your guests can chat amongst yourselves during the game.</p>
        </div>
        <hr className={styles.divider} />
        <div className={styles.content}>
          <p>You can invite up-to 24 guests by sharing the link with them.</p>
          {error && <p className={styles.error}>{error}</p>}
        </div>
      </div>
      <div className={styles.actions}>
        <Button href="/" intent="tertiary" disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={handleCreateChat} disabled={isLoading} loading={isLoading}>
          {isLoading ? "Creating..." : "Create Chat"}
        </Button>
      </div>
    </section>
  )
}

