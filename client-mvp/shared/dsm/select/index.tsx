import { VariantProps, cva } from 'cva';

import { SelectHTMLAttributes } from 'react';
import styles from './styles.module.sass';

const select = cva(styles.base, {
  variants: {
    state: {
      error: styles.error,
    },
  },
});

type Option = {
  label: string;
  value: string;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;
type Props = VariantProps<typeof select> &
  SelectProps & { options: Option[]; placeholder?: string };

export function Select(props: Props) {
  const { options, placeholder, ...rest } = props;

  return (
    <div className={select()}>
      <select className={styles.control} {...rest}>
        {placeholder && <option>{placeholder}</option>}
        {options.map((option) => (
          <option key={option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}