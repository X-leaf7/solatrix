'use client';

import { OTPInput, OTPInputProps, SlotProps } from 'input-otp';

import styles from './styles.module.sass';

type InputOTPProps = Omit<
  OTPInputProps,
  'maxLength' | 'render' | 'children'
> & {
  required?: boolean;
};

export function InputOTP(props: InputOTPProps) {
  const { ...rest } = props;

  return (
    <OTPInput
      maxLength={6}
      render={({ slots }) => (
        <div className={styles.base}>
          {slots.map((slot, idx) => (
            <Slot key={idx} {...slot} />
          ))}
        </div>
      )}
      {...rest}
    />
  );
}

function Slot(props: SlotProps) {
  const { char } = props;

  return <div className={styles.control}>{char}</div>;
}
