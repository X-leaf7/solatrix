"use client"

import type React from "react"

import { createContext, useState, useMemo, type ReactNode, type ReactElement } from "react"
import useModal from "@/shared/hooks/useModal"

// Define the interface for the context value
interface ModalContextType {
  modalActive: boolean
  toggleModal: () => void
  modalProps?: ModalProps
  setModalProps: React.Dispatch<React.SetStateAction<ModalProps | undefined>>
  modalContent?: ReactElement
  setModalContent: React.Dispatch<React.SetStateAction<ReactElement | undefined>>
}

// Define a generic interface for modal props
interface ModalProps {
  type?: string
  [key: string]: any
}

// Create the context with a default value
const ModalContext = createContext<ModalContextType>({
  modalActive: false,
  toggleModal: () => {},
  modalContent: <></>,
  modalProps: undefined,
  setModalProps: () => {},
  setModalContent: () => {},
})

// Define the props interface for the provider component
interface ModalProviderProps {
  children: ReactNode
}

function ModalProvider({ children }: ModalProviderProps): ReactElement {
  const [modalActive, toggleModal] = useModal()
  const [modalContent, setModalContent] = useState<ReactElement | undefined>()
  const [modalProps, setModalProps] = useState<ModalProps | undefined>()

  return (
    <ModalContext.Provider
      value={useMemo(() => {
        return {
          modalActive,
          toggleModal,
          modalProps,
          setModalProps,
          modalContent,
          setModalContent,
        }
      }, [modalActive, toggleModal, modalProps, setModalProps, modalContent, setModalContent])}
    >
      {children}
    </ModalContext.Provider>
  )
}

export { ModalContext, ModalProvider }
export type { ModalContextType, ModalProps }

