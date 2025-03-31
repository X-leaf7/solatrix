'use client';

import { Button } from '@/shared/dsm';
import Image from 'next/image';
import styles from './styles.module.sass';

type AvatarUploadProps = {
  href: string;
};

export function AvatarUpload(props: AvatarUploadProps) {
  const { href } = props;

  return (
    <div className={styles.base}>
      <figure className={styles.image}>
        <Image
          src="/images/avatar-default.png"
          width={115}
          height={115}
          alt="Avatar"
        />
      </figure>
      <div className={styles.action}>
        <Button href={href} intent="secondary" size="medium" icon="edit" />
      </div>
    </div>
  );
}
