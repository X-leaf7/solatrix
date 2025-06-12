'use client';

import { PropsWithChildren } from 'react';
import { useRouter } from 'next/navigation';

import { Content } from '@/shared/components';
import { Icons } from '@/shared/dsm';

import styles from './styles.module.sass';

type PageModalProps = {
  title: string;
  meta?: string;
};

export function PageModal(props: PropsWithChildren<PageModalProps>) {
  const { title, meta, children } = props;
  const CloseIcon = Icons['close'];

  const router = useRouter();

  function handleDismiss() {
    router.back();
  }

  return (
    <article className={styles.base}>
      <header className={styles.header}>
        <div className={styles.group}>
          <h2 className={styles.heading}>{title}</h2>
          {meta && <div className={styles.meta}>{meta}</div>}
        </div>
        <button className={styles.action} onClick={handleDismiss}>
          <CloseIcon />
        </button>
      </header>
      <div className={styles.box}>
        <Content>{children}</Content>
      </div>
    </article>
  );
}
