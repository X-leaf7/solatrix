import { Metadata } from 'next';

import { MainLayout } from '@/shared/layouts';
import { PropsWithChildren, ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Split Side',
  description:
    'Create an Invite-Only Chat Place to Share with Friends & Family',
};

export default function RootLayout({
  children,
  modal,
}: Readonly<PropsWithChildren<{ modal: ReactNode }>>) {
  return (
    <MainLayout modal={modal}>
      {children}
    </MainLayout>
  );
}
