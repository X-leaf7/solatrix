'use client'

import React from 'react'
import Image from 'next/image';
import { parseAsInteger, useQueryState } from 'nuqs';
import { Button, LogoMark } from '@/shared/dsm'

import { FormSignIn } from '../components'
import styles from './page.module.sass';

const SignIn = () => {
  const [step, setStep] = useQueryState("step", parseAsInteger)

  return (
    <div className={styles.base}>
      <div className={styles.box}>
        <figure className={styles.logo}>
          <LogoMark />
        </figure>
        <div className={styles.group}>
          <h2 className={styles.heading}>Please Sign In</h2>
          <div className={styles.content}>
            <p>A verification code will be sent to the provided address.</p>
          </div>
        </div>
      </div>
      <div className={styles.actions}>
        <FormSignIn step={step} setStep={setStep}/>
        {step !== 2 && (
          <div className={styles.action}>
            <Button icon="logoGoogle" intent="secondary">
              Sign in with Google
            </Button>
          </div>
        )}
      </div>
      <Image
        src="/images/bg-sign-in-1-mobile.jpg"
        width={375}
        height={812}
        alt="Gradient background pattern"
        className={styles.bgimage}
      />
    </div>
  )
}

export default SignIn
