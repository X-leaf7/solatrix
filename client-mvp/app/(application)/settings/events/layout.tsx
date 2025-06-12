import { PropsWithChildren } from 'react';
import { TabsMyEvents } from '@/features/settings/components';
import { EventsProvider } from '@/features/event-dashboard/provider';

import styles from './layout.module.sass';

export default function Layout(props: PropsWithChildren) {
  const { children } = props;

  return (
    <div className={styles.base}>
      <header className={styles.header}>
        <h2 className={styles.heading}>My Events</h2>
        <TabsMyEvents />
      </header>
      <EventsProvider>
        {children}
      </EventsProvider>
    </div>
  );
}
