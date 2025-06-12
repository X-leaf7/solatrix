'use client';

import React from 'react';
import Form from 'next/form';
import { cx } from 'cva';
import { usePathname } from 'next/navigation';
import { PropsWithChildren } from 'react';

import { Button, Toggle } from '@/shared/dsm';
import { UserProvider, MyEventsProvider } from '../providers';
import styles from './layout.module.sass';
import { NavigationGroup, NavigationSettings } from './navigation';

export const SettingsLayout = (props: PropsWithChildren) => {
  const { children } = props;
  const pathname = usePathname();

  const isMain =
    pathname === '/settings' ||
    pathname === '/privacy' ||
    pathname === '/terms';
  const isMainClass = !isMain ? styles['is-not-main'] : styles['is-main'];

  return (
    <UserProvider>
      <MyEventsProvider>
        <div className={cx(styles.base, isMainClass)}>
          <h2 className={styles.heading}>Settings</h2>
          <div className={styles.box}>
            <aside className={styles.aside}>
              <div className={styles.items}>
                <NavigationGroup heading="System">
                  <Form action="/" className={styles.toggle}>
                    <label htmlFor="notifications">Notifications</label>
                    <Toggle size="large" id="notifications" />
                  </Form>
                </NavigationGroup>
                <NavigationSettings />
              </div>
            </aside>
            <hr className={styles.divider} />
            <div className={styles.action}>
              <Button href="/settings" intent="tertiary" icon="arrowBack" />
            </div>
            <div className={styles.main}>{children}</div>
          </div>
        </div>
      </MyEventsProvider>
    </UserProvider>
  );
}
