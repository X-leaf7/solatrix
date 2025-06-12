import { Avatar } from '@/shared/dsm';
import { Message } from '../../types';

import styles from './styles.module.sass';

interface MessageHostProps {
  message: Message
}

export const MessageHost: React.FC<MessageHostProps> = ({ message }) => {
  const name = `${message.firstName} ${message.lastName}`;

  return (
    <article className={styles.base}>
      <header className={styles.header}>
        <Avatar size="small" />
        <h3 className={styles.heading}>{name}</h3>
      </header>
      <div className={styles.content}>
        <p>{message.text}</p>
      </div>
    </article>
  );
}
