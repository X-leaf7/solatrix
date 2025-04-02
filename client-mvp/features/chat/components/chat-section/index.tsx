'use client'

import { useCallback, useEffect } from 'react';
import { getCookie } from 'cookies-next/client';

import { ChatEventCard } from './card';
import { ChatEventInfo } from './info';
import { ChatSubmitForm } from '../submit-form';
import { MessageItem } from '../message-item';
import { Message } from '../../types';

import { getChatEvent } from '@/data';
import styles from './styles.module.sass';
import { useChatContext, useWebSocket } from '../../providers';

export function ChatSection() {
  const userCookie = getCookie('user');
  let userId = 'anonymous';

  if (userCookie) {
    const userData = JSON.parse(userCookie as string);
    userId = userData.id || userData.user_id || "anonymous";
  }

  const { messages, addMessage, setMessages } = useChatContext()
  const websocketService = useWebSocket()

  // <--------------- Handle Data Fetching ---------------->
  const fetchData = useCallback(async () => {
    // TODO: Replace with actual api
    const data = await getChatEvent()

    setMessages(data)
  }, [getChatEvent])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // <--------------- Handle Websocket Events ---------------->
  const validateReceivedMessage = (data: any) => {
    if (typeof data.message !== 'string' || !data.message.trim()) {
      return false
    }
    if (typeof data.sender_id !== 'string' || !data.sender_id.trim()) {
      return false
    }
    if (typeof data.message_id !== 'string' || !data.message_id.trim()) {
      return false
    }
    if (typeof data.profile_image_url !== 'string') {
      return false
    }

    return true
  }

  const handleMessageReceive = useCallback((data: any) => {
    const isValid = validateReceivedMessage(data)

    if (isValid) {
      const newMessage: Message = {
        id: data.message_id,
        text: data.message,
        profileImage: data.profile_image_url,
        isCurrentUser: data.sender_id === userId
      }

      addMessage(newMessage)
    }
  }, [
    userId,
    validateReceivedMessage,
    addMessage
  ])

  useEffect(() => {
    websocketService.unRegisterOnMessageHandler(
      'message_received',
      handleMessageReceive
    )

    websocketService.registerOnMessageHandler(
      'message_received',
      handleMessageReceive
    )

    return () => {
      websocketService.unRegisterOnMessageHandler(
        'message_received',
        handleMessageReceive
      )
    }
  }, [
    handleMessageReceive
  ])
  
  return (
    <section className={styles.base}>
      <header>
        <ChatEventCard />
        <ChatEventInfo />
      </header>
      <div className={styles.box}>
        <ul className={styles.messages}>
          {messages.map((message: Message) => (
            <MessageItem key={message.id} message={message} />
          ))}
        </ul>
        <ChatSubmitForm />
      </div>
    </section>
  );
}
