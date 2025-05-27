"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from "react"
import { IUser } from "@/shared/types"

interface UserContextType {
  user: IUser | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUserData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/user")

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch user data")
      }

      const userData = await response.json()
      setUser({
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        avatar: userData.avatar,
      })
    } catch (err) {
      console.error("Error fetching user data:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    // Clear user data from context
    setUser(null)

    // You might want to call an API to invalidate the token or clear cookies
    // This is a simplified example
    document.cookie = "split_access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"

    // Optionally redirect to login page
    // window.location.href = "/login"
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        error,
        refetch: fetchUserData,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)

  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }

  return context
}
