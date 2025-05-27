'use client'

import { Action, Button, ControlledToggle } from '@/shared/dsm'
import { parseAsBoolean, useQueryState } from 'nuqs'

import Image from 'next/image'
import styles from './styles.module.sass'
import { toast } from 'sonner'
// import { useCopyToClipboard } from 'usehooks-ts'
import { useParams } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

export function ChatInvite() {
  // const [, copy] = useCopyToClipboard()

  const [stream, setStream] = useQueryState(
    'stream',
    parseAsBoolean.withDefault(true),
  )

  const params = useParams()

  const searchParams = useSearchParams()

  const chatId = params.id as string
  
  const invitationCode = searchParams.get("code")
  const eventId = searchParams.get("eventId")

  const handleCopy = useCallback(() => {
    try {
      const currentHost = window.location.origin

      const inviteUrl = `${currentHost}/event/choose?modal=true&chatId=${chatId}&code=${invitationCode}&eventId=${eventId}`

      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(inviteUrl)
      } else {
        const textarea = document.createElement("textarea")
        textarea.value = inviteUrl
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand("copy")
        document.body.removeChild(textarea)
      }

      // copy(inviteUrl)

      toast("Copied the invite link.")
    } catch (error) {
      console.error("Failed to copy invite link:", error)
      toast.error("Failed to copy invite link. Please try again.")
    }
  }, [chatId, invitationCode, eventId])

  return (
    <section className={styles.base}>
      <figure className={styles.image}>
        <Image
          src="/images/illustration-error.png"
          width={120}
          height={120}
          alt="Error State"
        />
      </figure>
      <header className={styles.header}>
        <h2 className={styles.heading}>Invite Guests?</h2>
        <div className={styles.content}>
          <p>Host up-to 24 guests in a private chat for the match</p>
        </div>
      </header>
      <div className={styles.group}>
        <Action heading="Access link" content="Available in Settings > Events">
          <Button
            intent="secondary"
            size="medium"
            icon="link"
            onClick={handleCopy}
          >
            Copy Link
          </Button>
        </Action>
        <Action
          heading="Video Stream"
          content="As the host, you can live stream to the fans in the chat. This turns
            it on when you enter. You can turn if on and off in the chat at
            anytime."
        >
          <ControlledToggle size="large" state={stream} setState={setStream} />
        </Action>
      </div>
      <div className={styles.fineprint}>
        <p></p>
      </div>
      <div className={styles.actions}>
        <Button href="/settings" intent="tertiary">
          Go to Settings
        </Button>
        <Button href={`/chat/${chatId}?stream=${stream}`}>Enter Chat</Button>
      </div>
    </section>
  )
}
