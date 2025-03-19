'use client';

import { VariantProps, cva } from 'cva';

import styles from './styles.module.sass';
import { useState } from 'react';

const toggle = cva(styles.base, {
  variants: {
    size: {
      large: styles.large,
      medium: styles.medium,
      long: styles.long,
    },
    on: {
      true: styles.on,
      false: styles.off,
    },
  },
});

type BaseProps = {
  state: boolean;
  disabled?: boolean;
  setState: (state: boolean) => void;
  id?: string;
} & VariantProps<typeof toggle>;

function Base(props: BaseProps) {
  const { disabled, state, size = 'medium', setState, id } = props;

  const handleClick = () => setState(!state);
  const style = toggle({ size, on: state });

  return (
    <button
      onClick={handleClick}
      className={style}
      type="button"
      title="toggle"
      disabled={disabled}
      id={id}
    >
      <div className={styles.switch}></div>
    </button>
  );
}

export type ToggleProps = {
  disabled?: boolean;
  id?: string;
} & VariantProps<typeof toggle>;

export function Toggle(props: ToggleProps) {
  const [state, setState] = useState<boolean>(false);

  return <Base state={state} setState={setState} {...props} />;
}

export function ControlledToggle(props: BaseProps) {
  return <Base {...props} />;
}
