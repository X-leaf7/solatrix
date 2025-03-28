'use client';

import { useRouter } from 'next/navigation';
import { setCookie } from 'cookies-next/client';
import { parseAsInteger, useQueryState } from 'nuqs';
import Form from 'next/form';

import styles from './styles.module.sass';
import { REST_API_BASE_URL } from '@/constants';
import {
  Button,
  Input,
  InputField,
  InputOTP
} from '@/dsm';

export function FormSignIn() {
  const [email, setEmail] = useQueryState('email');
  const [step, setStep] = useQueryState('step', parseAsInteger);
  const [code, setCode] = useQueryState('code');
  const router = useRouter();

  async function formAction() {

    if (email && !code) {
      try {
        const response = await fetch(`${REST_API_BASE_URL}/api/otp_start/`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({email: email}),
        })

        if (response.ok) {
          setStep(2)
        } else {
          console.log('Error in OTP start response: ', response.status)
        }
      } catch (error) {
        console.log('Got an error in OTP start: ', error)
      }
    }

    if (email && code) {
      try {
        const response = await fetch(`${REST_API_BASE_URL}/api/otp_login/`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({email: email, code: code}),
        })

        if (response.ok) {
          const responseData = await response.json();
          setCookie('userInfo', JSON.stringify(responseData.user))
          setCookie('Token', responseData.auth_token)
          router.push('/')
        } else {
          console.log('Error in OTP login response: ', response.status)
        }
      } catch (error) {
        console.log('Got an error in OTP login: ', error)
      }
    }
  }

  return (
    <Form action={formAction}>
      <div className={styles.group}>
        {step !== 2 && (
          <InputField label="Email">
            <Input
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              placeholder="Enter your email"
              value={email || ''}
              required
            />
          </InputField>
        )}
        {step === 2 && (
          <InputField label="Verification Code" text="Resend Code">
            <InputOTP
              onChange={(value) => {setCode(value)}}
              name="code"
              required
            />
          </InputField>
        )}
      </div>
      <div className={styles.action}>
        <Button type="submit">{step === 2 ? 'Sign In' : 'Next'}</Button>
      </div>
    </Form>
  );
}
