'use client';

import { Button } from '@/shared/dsm';
import Image from 'next/image';
import styles from './styles.module.sass';

type SignOutProps = {
  onDismiss?: () => void;
};

export function SignOut(props: SignOutProps) {
  const { onDismiss } = props;

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
        <h2 className={styles.heading}>Sign Out</h2>
        <div className={styles.content}>
          <p>You are going to sign out from your account.</p>
        </div>
      </header>
      <div className={styles.actions}>
        <Button
          onClick={onDismiss}
          href="/settings/danger-zone"
          intent="tertiary"
        >
          Cancel
        </Button>
        <Button href="/sign-in" intent="danger">
          Sign Out
        </Button>
      </div>
    </section>
  );
}
