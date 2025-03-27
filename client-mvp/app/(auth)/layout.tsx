import Image from 'next/image';
import { PropsWithChildren } from 'react';
import styles from './layout.module.sass';

export default function Layout({ children }: Readonly<PropsWithChildren>) {
  return (
    <main className={styles.main}>
      <div className={styles.box}>
        <div className={styles.inner}>{children}</div>
      </div>
      <figure className={styles.image}>
        <Image src="/images/sign-in.jpg" width={725} height={780} alt="Image" />
      </figure>
    </main>
  );
}
