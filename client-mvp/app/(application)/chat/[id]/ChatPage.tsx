'use client'

import React, { useCallback, useEffect } from 'react'
import { cx } from 'cva';
import { useParams, useSearchParams } from 'next/navigation';

import { ChatEvent, ChatHost } from '@/components';
import ChatVideo from '@/components/01-cards/chat-video';

import styles from './page.module.sass';

const ChatPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();

  const chatId = params.id as string
  const invitationCode = searchParams.get("code")

  const fetchData = useCallback(async () => {
    await joinRoom()
  }, [invitationCode, chatId])

  const joinRoom = useCallback(async () => {

  }, [invitationCode, chatId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

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
