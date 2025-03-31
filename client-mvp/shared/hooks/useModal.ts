"use client"

import { useState } from "react"

/**
 * A hook for managing modal state
 * @returns A tuple containing the modal state and a toggle function
 */
const useModal = (): [boolean, () => void] => {
  const [modalActive, setModalActive] = useState<boolean>(false)

  /**
   * Toggles the modal state between active and inactive
   */
  function toggleModal(): void {
    setModalActive(!modalActive)
  }

  return [modalActive, toggleModal]
}

export default useModal
