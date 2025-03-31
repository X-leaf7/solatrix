import { Button, IconName, Logo } from '@/shared/dsm';
import Link, { LinkProps } from 'next/link';

import styles from './style.module.sass';

export function Footer() {
  return (
    <footer className={styles.base}>
      <div className={styles.boxed}>
        <div className={styles.box1}>
          <Link href="/" className={styles.logo} title="Home">
            <Logo />
          </Link>
          <p className={styles.colophon}>
            &copy; {new Date().getFullYear()} Split-Side, Inc. All Rights
            Reserved.
          </p>
        </div>
        <div className={styles.box2}>
          <nav className={styles.navigation}>
            <Link className={styles.anchor} href="/">
              Events
            </Link>
            <Link className={styles.anchor} href="/privacy">
              Privacy Policy
            </Link>
            <Link className={styles.anchor} href="/terms">
              Terms of Use
            </Link>
          </nav>
          <nav className={styles.social}>
            <SocialAnchor href="https://x.com" icon="twitter" />
            <SocialAnchor href="https://tiktok.com" icon="tiktok" />
            <SocialAnchor href="https://instagram.com" icon="instagram" />
          </nav>
        </div>
      </div>
    </footer>
  );
}

type SocialAnchorProps = {
  href: LinkProps['href'];
  icon: IconName;
};

function SocialAnchor(props: SocialAnchorProps) {
  return <Button size="medium" intent="secondary" {...props} />;
}
