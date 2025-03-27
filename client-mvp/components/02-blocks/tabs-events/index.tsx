'use client';

import { Tabs } from '@/dsm';
import { usePathname } from 'next/navigation';

const tabs = [
  {
    href: '/',
    label: 'Live now',
  },
  {
    href: '/upcoming',
    label: 'Upcoming',
  },
  {
    href: '/previous',
    label: 'Previous',
  },
];

export function TabsEvents() {
  const pathname = usePathname();
  const activeIndex = tabs.findIndex((tab) => tab.href === pathname);
  return <Tabs tabs={tabs} activeIndex={activeIndex} />;
}
