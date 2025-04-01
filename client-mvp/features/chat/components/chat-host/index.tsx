'use client'

import { Suspense, useCallback, useEffect, useState } from 'react';

import { MessageHost } from '../message-host';
import { getChatHost } from '@/data';
import styles from './styles.module.sass';

export function ChatHost() {
  // const data = await getChatHost();
  const [data, setData] = useState([])

  const fetchData = useCallback(async () => {
    const data = await getChatHost()

    setData(data)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <section className={styles.base}>
      <header className={styles.header}>
        <h2 className={styles.heading}>Host Chats</h2>
      </header>
      <Suspense>
        <div className={styles.grid}>
          {data.map((message) => (
            <MessageHost key={message.id} {...message} />
          ))}
        </div>
      </Suspense>
    </section>
  );
}
