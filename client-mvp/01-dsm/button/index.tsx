'use client';

import {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  PropsWithChildren,
} from 'react';

import { type IconName, Icons } from '../icons';
import type { VariantProps } from 'cva';
import { cva } from 'cva';
import styles from './style.module.sass';
import Link, { LinkProps } from 'next/link';

const button = cva(styles.base, {
  variants: {
    intent: {
      primary: styles.primary,
      secondary: styles.secondary,
      tertiary: styles.tertiary,
      danger: styles.danger,
      ghost: styles.ghost,
    },
    size: {
      large: styles.large,
      medium: styles.medium,
      small: styles.small,
    },
    error: {
      true: styles.error,
    },
    hasIcon: {
      true: styles.hasIcon,
    },
  },
  defaultVariants: {
    intent: 'primary',
    size: 'large',
  },
});

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;
type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement>;
type Combined = ButtonProps | AnchorProps;
type Props = VariantProps<typeof button> &
  Combined & { icon?: IconName; loading?: boolean; error?: boolean };

export function Button(props: PropsWithChildren<Props>) {
  const {
    children,
    type = 'button',
    intent,
    error,
    icon,
    size,
    ...rest
  } = props;

  const style = button({ intent, size, error, hasIcon: !!icon && !children });
  const Icon = icon ? Icons[icon] : null;

  if ('href' in rest) {
    return (
      <Link
        href={rest.href as LinkProps['href']}
        className={style}
        {...(rest as AnchorProps)}
      >
        {Icon && <Icon />}
        {children}
      </Link>
    );
  }

  return (
    <button
      className={style}
      type={type as ButtonProps['type']}
      {...(rest as ButtonProps)}
    >
      {Icon && <Icon />}
      {children}
    </button>
  );
}
