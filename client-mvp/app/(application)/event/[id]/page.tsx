import { Button } from '@/shared/dsm';
import styles from './page.module.sass';

export default function Page() {
  return (
    <article className={styles.base}>
      <header className={styles.header}>
        <div>
          <Button href="/" intent="tertiary" size="large" icon="arrowBack" />
        </div>
        <div />
        <div />
      </header>
      <div className={styles.grid}>
        <div className={styles.box1}>
          {/* <Event /> */}
          <div className={styles.actions}>
            <Button intent="tertiary">Create Chat</Button>
            <Button href={`/chat/one`}>Enter the Chat</Button>
          </div>
        </div>
        <hr className={styles.divider} />
        <div />
        <div />
      </div>
    </article>
  );
}
