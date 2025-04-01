'use client';

import { Button } from '@/shared/dsm';
import Image from 'next/image';
import styles from './styles.module.sass';

type SignOutProps = {
  onDismiss?: () => void;
};

export function Deactivate(props: SignOutProps) {
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
        <h3 className={styles.heading}>Confirm Account Deactivation</h3>
        <div className={styles.content}>
          <p>
            Deactivating your account is permanent and cannot be undone. Are you
            sure you want to proceed?
          </p>
        </div>
      </header>
      <div className={styles.actions}>
        {onDismiss && (
          <Button
            onClick={onDismiss}
            href="/settings/danger-zone"
            intent="tertiary"
          >
            Cancel
          </Button>
        )}
        <Button href="/" intent="danger">
          Deactivate
        </Button>
      </div>
    </section>
  );
}
