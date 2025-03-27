import { ChatEventCard } from './card';
import { ChatEventInfo } from './info';
import { FormChatEvent } from '@/components/04-forms';
import { MessageEvent } from '@/components/01-cards';
import { getChatEvent } from '@/data';
import styles from './styles.module.sass';

export async function ChatEvent() {
  const data = await getChatEvent();

  return (
    <section className={styles.base}>
      <header>
        <ChatEventCard />
        <ChatEventInfo />
      </header>
      <div className={styles.box}>
        <ul className={styles.messages}>
          {data.map((event) => (
            <MessageEvent key={event.id} {...event} />
          ))}
        </ul>
        <FormChatEvent />
      </div>
    </section>
  );
}
