'use client';

import { Button } from '@/shared/dsm';
import Image from 'next/image';
import { useUser } from '../../providers';

import styles from './styles.module.sass';

type AvatarUploadProps = {
  href: string;
};

export function AvatarUpload(props: AvatarUploadProps) {
  const { href } = props;
  const { user } = useUser()

  return (
    <div className={styles.base}>
      <figure className={styles.image}>
        <Image
          src={user?.avatar ?? "/images/avatar-default.png"}
          width={115}
          height={115}
          alt="Avatar"
          style={{
            height: '100%',
            objectFit: 'cover',
            borderRadius: '50%',
            objectPosition: 'center',
          }}
        />
      </figure>
      <div className={styles.action}>
        <Button
          href={href}
          intent="secondary"
          size="medium"
          icon="edit"
        />
      </div>
    </div>
  );
}
