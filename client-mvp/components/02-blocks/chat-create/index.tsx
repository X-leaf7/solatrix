'use client';

import { Button } from '@/dsm';
import Image from 'next/image';
import styles from './styles.module.sass';

export function ChatCreate() {
  return (
    <section className={styles.base}>
      <figure className={styles.image}>
        <Image
          src="/images/illustration-error.png"
          width={120}
          height={120}
          alt="Error State"
        />
      </figure>
      <h2 className={styles.heading}>Create private chat?</h2>
      <div className={styles.box}>
        <div className={styles.fineprint}>
          <p>
            A private room with a unique link will be created with you as the
            host.
          </p>
          <p>
            You and your guests can chat amongst yourselves during the game.
          </p>
        </div>
        <hr className={styles.divider} />
        <div className={styles.content}>
          <p>You can invite up-to 24 guests by sharing the link with them.</p>
        </div>
      </div>
      <div className={styles.actions}>
        <Button href="/" intent="tertiary">
          Cancel
        </Button>
        <Button href="/chat/1/invite">Create Chat</Button>
      </div>
    </section>
  );
}
