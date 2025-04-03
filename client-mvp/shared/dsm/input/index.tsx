import { VariantProps, cva } from 'cva';

import { InputHTMLAttributes } from 'react';
import styles from './styles.module.sass';

const input = cva(styles.base, {
  variants: {
    fullwidth: {
      true: styles.fullwidth,
    },
    error: {
      true: styles.error,
    },
  },
});

type InputProps = InputHTMLAttributes<HTMLInputElement>;
type Props = VariantProps<typeof input> & InputProps;

export function Input(props: Props) {
  const { error, fullwidth, ...restprops } = props;

  return (
    <div className={input({ error, fullwidth })}>
      <input className={styles.control} {...restprops} />
    </div>
  );
}
