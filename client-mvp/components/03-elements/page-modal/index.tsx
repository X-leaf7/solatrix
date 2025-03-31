'use client';

import { Content } from '@/components/02-blocks';
import { Icons } from '@/shared/dsm';
import { PropsWithChildren } from 'react';
import styles from './styles.module.sass';
import { useRouter } from 'next/navigation';

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
