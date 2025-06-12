'use client';

import { Button } from '@/shared/dsm';
import Image from 'next/image';
import styles from './styles.module.sass';

type ChatInviteProps = {
  onDismiss?: () => void;
};

export function VerificationSent(props: ChatInviteProps) {
  const { onDismiss } = props;

  function handleResend() {
    console.log('handle resend');
  }

  return (
    <section>
      <figure className={styles.image}>
        <Image
          src="/images/illustration-neutral.png"
          width={160}
          height={160}
          alt="Neutral State"
        />
      </figure>
      <h2 className={styles.heading}>The verification link has been sent</h2>
      <div className={styles.actions}>
        <Button onClick={onDismiss} intent="tertiary">
          Back
        </Button>
        <Button onClick={handleResend}>Resend</Button>
      </div>
    </section>
  );
}
