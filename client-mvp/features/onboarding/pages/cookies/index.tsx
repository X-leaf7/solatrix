'use client';

import { Button } from '@/shared/dsm';
import Image from 'next/image';
import styles from './styles.module.sass';

type CookiesProps = {
  onDismiss?: () => void;
};

export function Cookies(props: CookiesProps) {
  const { onDismiss } = props;

  console.log({ onDismiss });

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
        <h2 className={styles.heading}>
          We want to give you the best experience
        </h2>
      </header>
      <div className={styles.box}>
        <h3 className={styles.subheading}>Enabling cookies provides</h3>
        <ul className={styles.list}>
          <li>Personalized User Experience</li>
          <li>Seamless Login and Session Management</li>
          <li>Enhanced Content Recommendations</li>
          <li>Improved App Performance</li>
          <li>Personalization of Notifications</li>
          <li>Consistency Across Your Devices</li>
        </ul>
      </div>
      <div className={styles.actions}>
        <Button href="/onboarding/accept" intent="tertiary">
          Don’t Allow
        </Button>
        <Button href="/onboarding/accept">Allow</Button>
      </div>
    </section>
  );
}
