"use client"

import type React from "react"

import { Button, DragAndDrop, Icons } from "@/shared/dsm"
import { parseAsInteger, useQueryState } from "nuqs"
import Image from "next/image"
import { cx } from "cva"
import { useUser } from "../../providers"
import { useState, useEffect } from "react"

import styles from "./styles.module.sass"

type AvatarUploaderProps = {
  onDismiss?: () => void
}

export function AvatarUploader(props: AvatarUploaderProps) {
  const { onDismiss } = props
  const [step, setStep] = useQueryState("step", parseAsInteger.withDefault(1))

  function advanceStep() {
    setStep((step) => step + 1)
  }

  return (
    <div className={styles.base}>
      <div className={styles.box}>
        {step === 1 && <AvatarUploaderStepOne onDismiss={onDismiss} advanceStep={advanceStep} />}
        {step === 2 && <AvatarUploaderStepTwo onDismiss={onDismiss} />}
      </div>
    </div>
  )
}

interface IAvatarUploaderStepOneProps {
  onDismiss?: () => void
  advanceStep: () => void
}

const AvatarUploaderStepOne: React.FC<IAvatarUploaderStepOneProps> = ({ onDismiss, advanceStep }) => {
  const { user, refetch } = useUser()
  const Download = Icons["download"]
  const Edit = Icons["edit"]
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [showUploadForm, setShowUploadForm] = useState<boolean>(false)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize with user's avatar if available
  useEffect(() => {
    if (user?.avatar && !selectedImage) {
      setSelectedImage(user.avatar)
    }
  }, [user, selectedImage])

  function handleDrop(files: FileList) {
    if (files && files.length > 0) {
      const file = files[0]
      setSelectedFile(file)

      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === "string") {
          setSelectedImage(e.target.result)
          setShowUploadForm(false)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setSelectedFile(file)

      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === "string") {
          setSelectedImage(e.target.result)
          setShowUploadForm(false)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  function handleEditClick() {
    setShowUploadForm(true)
  }

  async function handleSave() {
    if (!selectedFile) {
      // If no new file was selected but user has an existing avatar,
      // we can just proceed to the success screen
      if (user?.avatar) {
        advanceStep()
        return
      }

      setError("Please select an image file")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("avatar", selectedFile)

      const response = await fetch("/api/user/avatar", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to upload avatar")
      }

      // Refresh user data to get the updated avatar URL
      await refetch()

      // Advance to success screen
      advanceStep()
    } catch (err) {
      console.error("Error uploading avatar:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <>
      <div className={styles.header}>
        <h2 className={styles.heading}>Change avatar</h2>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      {selectedImage && !showUploadForm ? (
        <div className={styles.avatarPreview}>
          <div className={styles.avatarContainer}>
            <Image
              src={selectedImage || "/placeholder.svg"}
              alt="Avatar preview"
              width={160}
              height={160}
              className={styles.avatarImage}
            />
            <button type="button" className={styles.editButton} onClick={handleEditClick} aria-label="Edit avatar">
              <Edit width={16} height={16} />
            </button>
          </div>
        </div>
      ) : (
        <DragAndDrop handleDrop={handleDrop}>
          {({ isDragging }) => (
            <form className={cx(styles.form, isDragging && styles.dragging)}>
              <Download width={56} height={56} />
              <input
                className={styles.file}
                type="file"
                name="avatar"
                id="file-avatar"
                accept="image/jpeg,image/png"
                onChange={handleFileChange}
              />
              <p className={styles.text}>Upload or drag and drop a JPG or PNG</p>
              <label htmlFor="file-avatar" className={styles.label}>
                Browse
              </label>
            </form>
          )}
        </DragAndDrop>
      )}

      <div className={styles.buttonContainer}>
        <Button size="long" onClick={onDismiss} intent="tertiary" disabled={isUploading}>
          Cancel
        </Button>
        {selectedImage && !showUploadForm && (
          <Button size="long" onClick={handleSave} loading={isUploading} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Save"}
          </Button>
        )}
      </div>
    </>
  )
}

interface IAvatarUploaderStepTwoProps {
  onDismiss?: () => void
}

function AvatarUploaderStepTwo({ onDismiss }: IAvatarUploaderStepTwoProps) {
  return (
    <div className={styles.successContainer}>
      <div className={styles.successContent}>
        <div className={styles.logoContainer}>
          <Image
            src="/images/illustration-success.png"
            width={160}
            height={160}
            alt="Success Logo"
            className={styles.successLogo}
          />
        </div>
        <h2 className={styles.successHeading}>Your avatar has been changed</h2>
        <p className={styles.successText}>Looking good!</p>

        {onDismiss && (
          <div className={styles.successButtonContainer}>
            <Button size="long" onClick={onDismiss}>
              Done
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
