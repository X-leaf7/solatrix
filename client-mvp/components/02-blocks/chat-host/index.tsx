import { MessageHost } from '@/components/01-cards';
import { Suspense } from 'react';
import { getChatHost } from '@/data';
import styles from './styles.module.sass';

export async function ChatHost() {
  const data = await getChatHost();

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
