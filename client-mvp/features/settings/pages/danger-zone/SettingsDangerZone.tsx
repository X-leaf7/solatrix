import React from 'react';

import styles from './page.module.sass';
import { Button } from '@/shared/dsm';

export const SettingsDangerZone = () => {
  return (
    <>
      <div className={styles.box}>
        <h3 className={styles.subheading}>Sign Out</h3>
        <div className={styles.content}>
          <p>You will be signed out.</p>
        </div>
        <div>
          <Button href="/settings/danger-zone/sign-out">Sign Out</Button>
        </div>
      </div>
      <div className={styles.box}>
        <h3 className={styles.subheading}>Deactivate Account</h3>
        <div className={styles.content}>
          <p>We will delete your account permanently.</p>
        </div>
        <div>
          <Button href="/settings/danger-zone/deactivate" intent="danger">
            Deactive Account
          </Button>
        </div>
      </div>
    </>
  )
}
