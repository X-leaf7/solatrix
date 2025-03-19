import { ChatEventCard } from './card';
import { ChatEventInfo } from './info';
import { FormChatEvent } from '@/02-components/04-forms';
import { MessageEvent } from '@/02-components/01-cards';
import { getChatEvent } from '@/03-data';
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
