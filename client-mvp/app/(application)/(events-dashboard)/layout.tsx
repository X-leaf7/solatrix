'use client';

import { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { FormEvents, TabsEvents } from '@/components';

import styles from './layout.module.sass';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const color = pathname === '/' ? 'green' : 'orange';

  return (
    <Suspense>
      <div className={styles.base}>
        <div className={styles.header}>
          <h1 className={styles.heading}>All events</h1>
          <FormEvents colorTheme={color} />
        </div>
        <div className={styles.tabs}>
          <TabsEvents />
        </div>
        {children}
      </div>
    </Suspense>
  );
}
