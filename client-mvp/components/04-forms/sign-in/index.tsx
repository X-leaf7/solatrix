"use client"

import { useRouter } from "next/navigation"
import { parseAsInteger, useQueryState } from "nuqs"
import Form from "next/form"

import styles from "./styles.module.sass"
import { Button, Input, InputField, InputOTP } from "@/dsm"

export function FormSignIn() {
  const [email, setEmail] = useQueryState("email")
  const [step, setStep] = useQueryState("step", parseAsInteger)
  const [code, setCode] = useQueryState("code")
  const router = useRouter()

  async function formAction() {
    if (email && !code) {
      try {
        // Use the proxy API route instead of direct backend call
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
        // Use the proxy API route instead of direct backend call
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

