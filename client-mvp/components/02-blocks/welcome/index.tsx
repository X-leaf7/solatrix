'use client';

import { Button } from '@/dsm';
import Image from 'next/image';
import styles from './styles.module.sass';

export function Welcome() {
  return (
    <section className={styles.base}>
      <figure>
        <Image
          src="/images/illustration-neutral.png"
          width={160}
          height={160}
          alt="Neutral State"
        />
      </figure>
      <header className={styles.header}>
        <h2 className={styles.heading}>Welcome to Split-Side!</h2>
        <div className={styles.content}>
          <p>
            Real-Time Game Talk: Where Fans Split Sides and Share in the Action!
          </p>
        </div>
      </header>
      <div className={styles.actions}>
        <Button href="/">Start Chatting</Button>
      </div>
    </section>
  );
}
