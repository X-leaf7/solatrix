import { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import Link, { LinkProps } from 'next/link';

import { cx } from 'cva';
import styles from './styles.module.sass';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;
type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement>;
type Combined = ButtonProps | AnchorProps;

export type TabProps = Combined & { label: string; active?: boolean };

export function Tab(props: TabProps) {
  const { label, active, ...rest } = props;

  const style = cx(styles.base, active && styles.active);

  if ('href' in rest) {
    return (
      <Link
        href={rest.href as LinkProps['href']}
        className={style}
        {...(rest as AnchorProps)}
      >
        {label}
      </Link>
    );
  }

  return (
    <button className={style} {...(rest as ButtonProps)}>
      {label}
    </button>
  );
}
