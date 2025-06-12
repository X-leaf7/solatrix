'use client';

import React from 'react';
import { cx } from 'cva';
import { Suspense } from 'react';

import {
  AvatarUpload,
  FormProfile,
  ProfileProgress
} from '../components';
import { useUser } from '../providers';

import styles from './page.module.sass';

export const SettingsMainPage = () => {
  const { user } = useUser();

  return (
    <div className={styles.base}>
      <h2 className={styles.heading}>Profile</h2>
      <div className={styles.grid}>
        <div className={cx(styles.box, styles.information)}>
          <AvatarUpload href="/settings/profile/avatar/upload" />
          <ProfileProgress label="Rookie" />
        </div>
        <div className={styles.box}>
          <Suspense>
            <FormProfile user={user} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
