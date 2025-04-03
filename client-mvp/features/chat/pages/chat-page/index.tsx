'use client'

import React, { useCallback, useEffect } from 'react'
import { getCookie } from 'cookies-next/client';
import { useParams, useSearchParams } from 'next/navigation';
import { cx } from 'cva';

import {
  ChatHost,
  ChatVideo,
  ChatSection
} from '../../components';

import styles from './page.module.sass';
import { useWebSocket } from '../../providers';

export const ChatPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();

  const chatId = params.id as string
  const invitationCode = searchParams.get("code")

  const userCookie = getCookie('user')
  let userId = 'anonymous'

  if (userCookie) {
    const userData = JSON.parse(userCookie as string)
    userId = userData.id || userData.user_id || "anonymous"
  }

  const fetchData = useCallback(async () => {
    await joinRoom()
  }, [invitationCode, chatId])

  const joinRoom = useCallback(async () => {

  }, [invitationCode, chatId])

  const chatWebsocketService = useWebSocket()

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    chatWebsocketService.disconnect()

    chatWebsocketService.connect(chatId, userId)

    return () => {
      chatWebsocketService.disconnect()
    }
  }, [chatId])

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
        <ChatSection />
      </div>
    </article>
  )
}
