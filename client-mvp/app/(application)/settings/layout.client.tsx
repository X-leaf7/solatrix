'use client';

import { NavigationGroup, NavigationSettings } from '@/components';

import { Button } from '@/shared/dsm';
import Form from 'next/form';
import { PropsWithChildren } from 'react';
import { Toggle } from '@/shared/dsm';
import { cx } from 'cva';
import styles from './layout.module.sass';
import { usePathname } from 'next/navigation';

export default function LayoutClient(props: PropsWithChildren) {
  const { children } = props;
  const pathname = usePathname();

  const isMain =
    pathname === '/settings' ||
    pathname === '/privacy' ||
    pathname === '/terms';
  const isMainClass = !isMain ? styles['is-not-main'] : styles['is-main'];

  return (
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
  );
}
