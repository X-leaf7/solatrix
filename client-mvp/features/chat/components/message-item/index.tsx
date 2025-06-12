import type React from "react"
import { cva } from "cva"

import { Avatar } from "@/shared/dsm"
import { Message } from "../../types"
import styles from "./styles.module.sass"

const userMessageStyles = cva(styles.base, {
  variants: {
    isAwaySelected: {
      true: styles.isAwaySelected,
    },
  },
})

interface MessageItemProps {
  message: Message
}

const UserMessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const style = userMessageStyles({ isAwaySelected: message.selectedTeam === 'away' })

  return (
    <li className={style}>
      <div className={styles.avatar}>
        <Avatar size="small" />
      </div>
      <div className={styles.content}>
        <p>{message.text}</p>
      </div>
    </li>
  )
}

const HostMessageItem: React.FC<MessageItemProps> = ({ message }) => {
  return (
    <div className={styles.hostBase}>
      <div className={styles.header}>
        <Avatar size="small" />
        <h3>{message.firstName} {message.lastName}</h3>
      </div>
      <p>
        {message.text}
      </p>
    </div>
  )
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  if (!message.isHostMessage) {
    return (
      <UserMessageItem message={message} />
    )
  } else {
    return (
      <HostMessageItem message={message} />
    )
  }
}

