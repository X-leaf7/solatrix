'use client';

import { Tabs } from '@/shared/dsm';
import { usePathname } from 'next/navigation';

const tabs = [
  {
    href: '/settings/events',
    label: 'Upcoming',
  },
  {
    href: '/settings/events/previous',
    label: 'Previous',
  },
];

export function TabsMyEvents() {
  const pathname = usePathname();
  const activeIndex = tabs.findIndex((tab) => tab.href === pathname);
  return <Tabs tabs={tabs} activeIndex={activeIndex} />;
}
