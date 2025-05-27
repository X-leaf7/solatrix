'use client'
import { useContext } from 'react';

import { MessageHost } from '../message-host';
import { useChatContext } from '../../providers';
import { OnAirButton } from './on-air-button';
import { BroadcastContext, LocalMediaContext } from '@/shared/providers';

import styles from './styles.module.sass';

export function ChatHost() {
  const { hostMessages } = useChatContext()
  const { isLive, toggleStream, streamPending } = useContext(BroadcastContext)
  const { permissions } = useContext(LocalMediaContext)

  return (
    <section className={styles.base}>
      <header className={styles.header}>
        <h2 className={styles.heading}>
          Host Chats
        </h2>
        <OnAirButton
          isLive={isLive}
          onClick={() => toggleStream()}
          loading={streamPending}
          disabled={!permissions || streamPending}
        />
      </header>
      
      <div className={styles.grid}>
        {hostMessages.map((message) => (
          <MessageHost
            key={message.id}
            message={message}
          />
        ))}
      </div>
    </section>
  );
}
