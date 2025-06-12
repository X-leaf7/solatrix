"use client"

import type React from "react"

import { type PropsWithChildren, cloneElement, isValidElement, useRef } from "react"

import { motion } from "framer-motion"
import styles from "./styles.module.sass"
import { useRouter } from "next/navigation"
import { cx } from "cva"

type ModalChildProps = {
  onDismiss?: () => void
}

type ModalSize = "small" | "medium" | "large" | "full"

interface ModalProps extends PropsWithChildren {
  size?: ModalSize
}

const backdropVariant = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
}

const modalVariant = {
  hidden: {
    y: "5vh",
  },
  visible: {
    y: 0,
    transition: {
      duration: 0.4,
      type: "spring",
      stiffness: 125,
    },
  },
}

export function Modal(props: ModalProps) {
  const ref = useRef<HTMLDialogElement | null>(null)

  const { children, size = "medium" } = props

  const router = useRouter()

  function onDismiss() {
    router.back()
  }

  function onClick(e: React.MouseEvent<HTMLDialogElement, MouseEvent>) {
    return e.target === ref.current && router.back()
  }

  const childWithProps = isValidElement<ModalChildProps>(children) ? cloneElement(children, { onDismiss }) : children

  return (
    <motion.dialog
      ref={ref}
      onClick={onClick}
      onClose={onDismiss}
      open
      className={styles.base}
      variants={backdropVariant}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <motion.div
        variants={modalVariant}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className={cx(styles.box, styles[`size-${size}`])}
      >
        {childWithProps}
      </motion.div>
    </motion.dialog>
  )
}
