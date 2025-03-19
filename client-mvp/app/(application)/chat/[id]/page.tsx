import { ChatEvent, ChatHost, ChatVideo } from '@/02-components';

import { cx } from 'cva';
import styles from './page.module.sass';

export default function Page() {
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
  );
}
