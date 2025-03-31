'use client';

import { Button } from '@/shared/dsm';
import styles from './styles.module.sass';

export function Accept() {
  return (
    <section className={styles.base}>
      <header className={styles.header}>
        <h2 className={styles.heading}>Terms of Use & Privacy Policy</h2>
        <div className={styles.content}>
          <p>
            Please review and accept our Terms of Use and Privacy Policy to
            access the Split-Side service.
          </p>
        </div>
      </header>
      <div className={styles.actions}>
        <Button href="/onboarding/welcome" intent="tertiary">
          Cancel
        </Button>
        <Button href="/onboarding/welcome">Accept</Button>
      </div>
    </section>
  );
}
