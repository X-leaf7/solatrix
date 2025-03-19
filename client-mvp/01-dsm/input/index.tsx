import { VariantProps, cva } from 'cva';

import { InputHTMLAttributes } from 'react';
import styles from './styles.module.sass';

const input = cva(styles.base, {
  variants: {
    fullWidth: {
      true: styles.fullWidth,
    },
    error: {
      true: styles.error,
    },
  },
});

type InputProps = InputHTMLAttributes<HTMLInputElement>;
type Props = VariantProps<typeof input> & InputProps;

export function Input(props: Props) {
  const { error, fullWidth } = props;

  return (
    <div className={input({ error, fullWidth })}>
      <input className={styles.control} {...props} />
    </div>
  );
}
