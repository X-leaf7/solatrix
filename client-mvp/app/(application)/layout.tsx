import { BackgroundSwitcher, Header } from '@/components';
import { PropsWithChildren } from 'react';

import styles from './layout.module.sass';

export default function Layout(props: PropsWithChildren) {
  const { children } = props;
  
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      overflow: 'hidden',
      paddingBottom: '40px'
    }}>
      <Header />
      <main className={styles.main}>{children}</main>
      <BackgroundSwitcher />
    </div>
  );
}
