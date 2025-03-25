import { FormProfile, ProfileProgress } from '@/components';

import { AvatarUpload } from '@/components';
import { Suspense } from 'react';
import { cx } from 'cva';
import styles from './page.module.sass';

export default function Page() {
  return (
    <Suspense>
      <div className={styles.base}>
        <h2 className={styles.heading}>Profile</h2>
        <div className={styles.grid}>
          <div className={cx(styles.box, styles.information)}>
            <AvatarUpload href="/settings/profile/avatar/upload" />
            <ProfileProgress label="Rookie" />
          </div>
          <div className={styles.box}>
            <FormProfile />
          </div>
        </div>
      </div>
    </Suspense>
  );
}
