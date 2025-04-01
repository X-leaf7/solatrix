'use client';

import { Children, PropsWithChildren } from 'react';

import Link from 'next/link';
import { cx } from 'cva';
import styles from './styles.module.sass';
import { usePathname } from 'next/navigation';

type NavigationSettingAnchor = {
  href: string;
  label: string;
};

type NavigationGroupProps = {
  heading: string;
};

export function NavigationSettings() {
  return (
    <nav className={styles.base}>
      <NavigationGroup heading="Profile">
        <NavigationItem href="/settings/profile" label="My Profile" />
      </NavigationGroup>
      <NavigationGroup heading="Events">
        <NavigationItem href="/settings/events" label="My Events" />
      </NavigationGroup>
      <NavigationGroup heading="Feedback and Rules">
        <NavigationItem href="/privacy" label="Privacy Policy" />
        <NavigationItem href="/terms" label="Terms of Use" />
      </NavigationGroup>
      <NavigationGroup heading="Danger Zone">
        <NavigationItem href="/settings/danger-zone" label="Danger Zone" />
      </NavigationGroup>
    </nav>
  );
}

function NavigationItem(props: NavigationSettingAnchor) {
  const { label, href } = props;
  const path = usePathname();

  const isActive =
    path === '/settings' ? href === '/settings/profile' : path.includes(href);

  return (
    <Link className={cx(styles.anchor, isActive && styles.active)} href={href}>
      {label}
    </Link>
  );
}

export function NavigationGroup(
  props: PropsWithChildren<NavigationGroupProps>,
) {
  const { heading, children } = props;

  const childrens = Children.toArray(children).flatMap((child, index, array) =>
    index < array.length - 1
      ? [child, <hr className={styles.divider} key={`hr-${index}`} />]
      : [child],
  );

  return (
    <div className={styles.group}>
      <h3 className={styles.heading}>{heading}</h3>
      {childrens}
    </div>
  );
}
