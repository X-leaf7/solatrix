import '@/dsm/app.sass';

import { DM_Sans, Open_Sans } from 'next/font/google';
import { Footer, Toaster } from '@/components';
import { PropsWithChildren, ReactNode } from 'react';

import { AnimatePresence } from 'framer-motion';
import type { Metadata } from 'next';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { cx } from 'cva';
import styles from './layout.module.sass';

import {
  BroadcastLayoutProvider,
  BroadcastMixerProvider,
  BroadcastProvider,
  LocalMediaProvider,
  ModalProvider,
  UserSettingsProvider
} from '@/shared/providers';

const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-open-sans',
  adjustFontFallback: false,
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
  adjustFontFallback: false,
});

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
    <html lang="en">
      <body className={cx(dmSans.className, openSans.className, styles.body)}>
        <NuqsAdapter>
          <ModalProvider>
            <UserSettingsProvider>
              <LocalMediaProvider>
                <BroadcastProvider>
                  <BroadcastMixerProvider>
                    <BroadcastLayoutProvider>
                      {children}
                    </BroadcastLayoutProvider>
                  </BroadcastMixerProvider>
                </BroadcastProvider>
              </LocalMediaProvider>
            </UserSettingsProvider>
          </ModalProvider>
          <Footer />
          <AnimatePresence mode="wait" initial={false}>
            {modal}
          </AnimatePresence>
          <Toaster />
        </NuqsAdapter>
      </body>
    </html>
  );
}
