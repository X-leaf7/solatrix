'use client';

import { Button } from '@/shared/dsm';
import Image from 'next/image';
import styles from './styles.module.sass';

export function Error() {
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
      <h2 className={styles.heading}>Oops, something went wrong.</h2>
      <div className={styles.content}>
        We can’t save your changes. Please, try again later.
      </div>
      <div className={styles.actions}>
        <Button href="/">Back</Button>
      </div>
    </section>
  );
}
