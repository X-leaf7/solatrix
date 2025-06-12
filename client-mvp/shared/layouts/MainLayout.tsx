'use client'

import React, { PropsWithChildren, ReactNode } from 'react'
import { Toaster } from 'sonner'
import { AnimatePresence } from 'framer-motion'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { DM_Sans, Open_Sans } from 'next/font/google'
import { cx } from 'cva'

import { Footer } from './footer'
import {
  BroadcastLayoutProvider,
  BroadcastMixerProvider,
  BroadcastProvider,
  LocalMediaProvider,
  ModalProvider,
  UserSettingsProvider
} from '../providers'
import { useBreakPoint } from '../hooks'

import '@/shared/dsm/app.sass';
import styles from './layout.module.sass';

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

const FooterWraper = () => {
  const { isMobileSmall, isMobileMedium, isMobileLarge } = useBreakPoint()

  if (isMobileSmall || isMobileMedium || isMobileLarge) {
    return null
  }

  return <Footer />
}

const MainLayout = ({
  children,
  modal,
}: Readonly<PropsWithChildren<{ modal: ReactNode }>>) => {
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
          <FooterWraper />
          <AnimatePresence mode="wait" initial={false}>
            {modal}
          </AnimatePresence>
          <Toaster />
        </NuqsAdapter>
      </body>
    </html>
  )
}

export default MainLayout
