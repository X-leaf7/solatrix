"use client"

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, PropsWithChildren } from "react"

import { type IconName, Icons } from "../icons"
import type { VariantProps } from "cva"
import { cva } from "cva"
import Link, { type LinkProps } from "next/link"

import styles from "./style.module.sass"

const button = cva(styles.base, {
  variants: {
    intent: {
      primary: styles.primary,
      secondary: styles.secondary,
      tertiary: styles.tertiary,
      danger: styles.danger,
      ghost: styles.ghost,
      secondaryWhite: styles.secondaryWhite,
    },
    size: {
      large: styles.large,
      medium: styles.medium,
      small: styles.small,
      long: styles.long,
    },
    error: {
      true: styles.error,
    },
    hasIcon: {
      true: styles.hasIcon,
    },
    isLoading: {
      true: styles.loading,
    },
  },
  defaultVariants: {
    intent: "primary",
    size: "large",
  },
})

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>
type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement>
type Combined = ButtonProps | AnchorProps
type Props = VariantProps<typeof button> & Combined & { icon?: IconName; loading?: boolean; error?: boolean; disabled?: boolean }

export function Button(props: PropsWithChildren<Props>) {
  const { children, type = "button", intent, error, icon, size, loading, ...rest } = props

  const style = button({
    intent,
    size,
    error,
    hasIcon: !!icon && !children,
    isLoading: !!loading,
  })

  const Icon = icon ? Icons[icon] : null

  // Determine icon size based on button size
  const getIconSize = () => {
    switch (size) {
      case "small":
        return 14
      case "medium":
        return 16
      case "large":
      default:
        return 20
    }
  }

  const iconSize = getIconSize()

  // Create loading spinner component
  const LoadingSpinner = () => (
    <span className={styles.spinner}>
      <svg className={styles.spinnerSvg} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <circle className={styles.spinnerCircle} cx="12" cy="12" r="10" fill="none" strokeWidth="3" />
      </svg>
    </span>
  )

  if ("href" in rest) {
    return (
      <Link
        href={rest.href as LinkProps["href"]}
        className={style}
        {...(rest as AnchorProps)}
        aria-disabled={loading}
        tabIndex={loading ? -1 : undefined}
      >
        {loading ? (
          <>
            <LoadingSpinner />
            {children}
          </>
        ) : (
          <>
            {Icon && <Icon width={iconSize} height={iconSize} />}
            {children}
          </>
        )}
      </Link>
    )
  }

  return (
    <button
      className={style}
      type={type as ButtonProps["type"]}
      disabled={loading || rest.disabled}
      {...(rest as ButtonProps)}
    >
      {loading ? (
        <>
          <LoadingSpinner />
          {children}
        </>
      ) : (
        <>
          {Icon && <Icon width={iconSize} height={iconSize} />}
          {children}
        </>
      )}
    </button>
  )
}
