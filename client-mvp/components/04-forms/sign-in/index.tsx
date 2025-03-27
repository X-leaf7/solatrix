'use client';

import { useRouter } from 'next/navigation';
import { setCookie } from 'cookies-next/client';
import { Button, Input, InputField, InputOTP } from '@/dsm';
import { parseAsInteger, useQueryState } from 'nuqs';

import Form from 'next/form';
import styles from './styles.module.sass';

export function FormSignIn() {
  const [email, setEmail] = useQueryState('email');
  const [step, setStep] = useQueryState('step', parseAsInteger);
  const [code, setCode] = useQueryState('code');
  const router = useRouter();

  async function formAction() {

    if (email && !code) {
      const codeResponse = await fetch('/api/otp_start/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email: email}),
      }).catch(err => console.log(err));

      if (!codeResponse || codeResponse.status === 400) {
        console.log("Got an error!");
      }
      else {
        setStep(2);
      }
    }

    if (email && code) {
      const verifyResponse = await fetch('/api/otp_login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email: email, code: code}),
      }).catch(err => console.log(err));

      if (!verifyResponse || verifyResponse.status === 400) {
        console.log("Got an error!");
      }
      else {
        const verifiedJson = await verifyResponse.json();
        setCookie('userInfo', JSON.stringify(verifiedJson.user))
        setCookie('Token', verifiedJson.auth_token)
        router.push('/')
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
