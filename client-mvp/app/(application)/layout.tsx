import { BackgroundSwitcher, Header } from '@/components';
import { PropsWithChildren, Suspense } from 'react';

import styles from './layout.module.sass';

export default function Layout(props: PropsWithChildren) {
  const { children } = props;
  return (
    <>
      <Header />
      <Suspense>
        <main className={styles.main}>{children}</main>
      </Suspense>
      <BackgroundSwitcher />
    </>
  );
}
