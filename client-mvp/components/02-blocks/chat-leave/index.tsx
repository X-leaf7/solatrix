'use client';

import { Button } from '@/shared/dsm';
import Image from 'next/image';
import styles from './styles.module.sass';

type ChatInviteProps = {
  onDismiss?: () => void;
};

export function ChatLeave(props: ChatInviteProps) {
  const { onDismiss } = props;

  return (
    <section>
      <figure className={styles.image}>
        <Image
          src="/images/illustration-error.png"
          width={160}
          height={160}
          alt="Error State"
        />
      </figure>
      <h2 className={styles.heading}>
        Are you sure you want to leave the chat?
      </h2>
      <div className={styles.actions}>
        <Button onClick={onDismiss} intent="tertiary">
          Cancel
        </Button>
        <Button href="/">Leave Chat</Button>
      </div>
    </section>
  );
}
