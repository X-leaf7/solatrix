import { FormEvents, TabsEvents } from '@/components';

import styles from './layout.module.sass';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.base}>
      <div className={styles.header}>
        <h1 className={styles.heading}>All events</h1>
        <FormEvents />
      </div>
      <div className={styles.tabs}>
        <TabsEvents />
      </div>
      {children}
    </div>
  );
}
