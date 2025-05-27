"use client"

import { Dispatch, SetStateAction, useState } from "react"
import { useRouter } from "next/navigation"
import { useQueryState } from "nuqs"
import Form from "next/form"

import { Button, Input, InputField, InputOTP, Icons } from "@/shared/dsm"
import styles from "./signin-form.module.sass"

interface FormSignInProps {
  step: number | null
  setStep: Dispatch<SetStateAction<number | null>>
}

export const FormSignIn: React.FC<FormSignInProps> = ({
  step,
  setStep
}) => {
  const [email, setEmail] = useQueryState("email")
  const [code, setCode] = useQueryState("code")
  const [emailError, setEmailError] = useState<string>()
  const router = useRouter()

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  async function formAction() {
    if (email && !validateEmail(email)) {
      setEmailError("Please enter a valid email address.")
      return
    }

    if (email && !code) {
      try {
        const response = await fetch("/api/auth/otp-start", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email }),
        })

        if (response.ok) {
          setStep(2)
        } else {
          const errorData = await response.json()
          console.log("Error in OTP start response:", response.status, errorData)
        }
      } catch (error) {
        console.log("Got an error in OTP start:", error)
      }
    }

    if (email && code) {
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email, code: code }),
        })

        if (response.ok) {
          // No need to manually set cookies anymore as they're set by the server
          // Just redirect the user after successful login
          router.push("/")
        } else {
          const errorData = await response.json()
          console.log("Error in OTP login response:", response.status, errorData)
        }
      } catch (error) {
        console.log("Got an error in OTP login:", error)
      }
    }
  }

  const AlertCircle = Icons['alertCircle']

  return (
    <Form action={formAction}>
      <div className={styles.group}>
        {step !== 2 && (
          <InputField label="Email">
            <Input
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              placeholder="Enter your email"
              value={email || ""}
              required
            />
          </InputField>
        )}
        {emailError && (
          <div className={styles.errorMessage}>
            <AlertCircle width={14} height={14} />
            <p className="">{emailError}</p>
          </div>
        )}

        {step === 2 && (
          <InputField label="Verification Code" text="Resend Code">
            <InputOTP
              onChange={(value) => {
                setCode(value)
              }}
              name="code"
              required
            />
          </InputField>
        )}
      </div>
      <div className={styles.action}>
        <Button type="submit">{step === 2 ? "Sign In" : "Next"}</Button>
      </div>
    </Form>
  )
}

