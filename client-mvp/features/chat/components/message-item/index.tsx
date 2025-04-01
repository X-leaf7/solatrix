import type React from "react"
import { cva } from "cva"

import { Avatar } from "@/shared/dsm"
import { Message } from "../../types"
import styles from "./styles.module.sass"

const messageStyles = cva(styles.base, {
  variants: {
    current: {
      true: styles.current,
    },
  },
})

interface MessageItemProps {
  message: Message
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const style = messageStyles({ current: message.isCurrentUser })

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

