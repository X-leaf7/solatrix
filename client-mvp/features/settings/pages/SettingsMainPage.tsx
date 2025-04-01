import React from 'react'
import { cx } from 'cva';

import styles from './page.module.sass';
import {
  AvatarUpload,
  FormProfile,
  ProfileProgress
} from '../components';

export const SettingsMainPage = () => {
  return (
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
  )
}
