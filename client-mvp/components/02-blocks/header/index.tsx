'use client';

import { Button, LogoMark } from '@/shared/dsm';

import Link from 'next/link';
import styles from './styles.module.sass';
import { usePathname } from 'next/navigation';

export function Header() {
  return (
    <header className={styles.base}>
      <div className={styles.boxed}>
        <Link href="/" className={styles.logo} title="Home">
          <LogoMark />
        </Link>
        <nav className={styles.nav}>
          <Buttons />
        </nav>
      </div>
    </header>
  );
}

function Buttons() {
  const pathname = usePathname();

  if (pathname.includes('chat')) {
    return (
      <Button href={`${pathname}/leave`} intent="secondary">
        Leave Chat
      </Button>
    );
  }

  return (
    <>
      <Button href="/sign-in" icon="event" size="medium" intent="ghost">
        Events
      </Button>
      <Button href="/sign-in" icon="enter" size="medium" intent="tertiary">
        Sign In
      </Button>
    </>
  );
}
