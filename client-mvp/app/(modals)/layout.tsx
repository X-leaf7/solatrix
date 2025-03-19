import { PropsWithChildren, Suspense } from 'react';

import styles from './layout.module.sass';

export default function Layout(props: PropsWithChildren) {
  const { children } = props;

  return (
    <Suspense>
      <div className={styles.base}>{children}</div>
    </Suspense>
  );
}
