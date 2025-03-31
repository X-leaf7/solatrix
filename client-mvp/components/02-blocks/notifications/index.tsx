'use client';

import { Button } from '@/shared/dsm';
import Image from 'next/image';
import styles from './styles.module.sass';

type NotificationsProps = {
  onDismiss?: () => void;
};

export function Notifications(props: NotificationsProps) {
  const { onDismiss } = props;

  console.log({ onDismiss });

  return (
    <section className={styles.base}>
      <figure>
        <Image
          src="/images/illustration-error.png"
          width={160}
          height={160}
          alt="Error State"
        />
      </figure>
      <header className={styles.header}>
        <h2 className={styles.heading}>
          We would like to send you notifications
        </h2>
        <div className={styles.content}>
          <p>
            Notifications may include alerts, sounds and icon badges. These can
            be configured in Settings.
          </p>
        </div>
      </header>
      <div className={styles.actions}>
        <Button href="/onboarding/cookies" intent="tertiary">
          Don’t Allow
        </Button>
        <Button href="/onboarding/cookies">Allow</Button>
      </div>
    </section>
  );
}
