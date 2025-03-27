'use client'

import React, { useEffect, useState } from 'react'

import { ChatEvent, ChatHost } from '@/components';
import ChatVideo from '@/components/01-cards/chat-video';

import { cx } from 'cva';
import styles from './page.module.sass';

const ChatPage = () => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <article className={cx(styles.base, styles['has-video'])}>
      <div className={styles.advertising}>Advertising</div>
      <div className={styles.host}>
        <div className={styles.video}>
          <ChatVideo />
        </div>
        <div className={styles.hostChat}>
          <ChatHost />
        </div>
      </div>
      <div className={styles.chat}>
        <ChatEvent />
      </div>
    </article>
  )
}

export default ChatPage
