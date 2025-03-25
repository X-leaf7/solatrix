import { Avatar, Button } from '@/dsm';

import styles from './styles.module.sass';

export function ChatEventInfo() {
  return (
    <div className={styles.base}>
      <div className={styles.link}>
        Chat <Button icon="paperPlane" size="small" intent="secondary" />
      </div>
      <div className={styles.box}>
        <Avatar size="small" />
        Host: Aly | 24 Users
      </div>
    </div>
  );
}
