'use client';

import { parseAsString, useQueryState } from 'nuqs';

import { Button } from '@/shared/dsm';
import Image from 'next/image';
import styles from './styles.module.sass';

export function EmailChanged() {
  const [email] = useQueryState('email', parseAsString);

  return (
    <section>
      <figure className={styles.image}>
        <Image
          src="/images/illustration-success.png"
          width={160}
          height={160}
          alt="Error State"
        />
      </figure>
      <h2 className={styles.heading}>
        Your email has been successfully changed
      </h2>
      <div className={styles.content}>
        You have successfully changed your email to {email}
      </div>
      <div className={styles.actions}>
        <Button href="/">Done</Button>
      </div>
    </section>
  );
}
