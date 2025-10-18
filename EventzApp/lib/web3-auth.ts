"use client"

import { useAccount, useDisconnect } from "wagmi"
import { getUserByWallet, createUserInFirestore, updateLastLogin, type User } from "./firestore-users"

const AUTH_KEY = "eventz_wallet_auth"
const AUTH_USER_KEY = "eventz_wallet_user"

/**
 * Hook for wallet-based authentication
 */
export function useWalletAuth() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  const authenticateWallet = async (): Promise<User | null> => {
    if (!address || !isConnected) return null

    try {
      // Check if user exists
      let user = await getUserByWallet(address)

      // Create user if doesn't exist
      if (!user) {
        user = await createUserInFirestore({
          walletAddress: address,
          role: "user",
        })
      } else {
        // Update last login
        await updateLastLogin(address)
      }

      // Store in localStorage for session management
      if (typeof window !== "undefined") {
        localStorage.setItem(AUTH_KEY, "true")
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
      }

      return user
    } catch (error) {
      console.error("Error authenticating wallet:", error)
      return null
    }
  }

  const logout = () => {
    disconnect()
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_KEY)
      localStorage.removeItem(AUTH_USER_KEY)
    }
  }

  const isAuthenticated = (): boolean => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(AUTH_KEY) === "true" && isConnected
    }
    return false
  }

  const getCurrentUser = (): User | null => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(AUTH_USER_KEY)
      if (stored && isConnected) {
        try {
          return JSON.parse(stored)
        } catch {
          return null
        }
      }
    }
    return null
  }

  return {
    address,
    isConnected,
    authenticateWallet,
    logout,
    isAuthenticated,
    getCurrentUser,
  }
}

/**
 * Server-side/non-hook authentication check
 */
export function isWalletAuthenticated(): boolean {
  if (typeof window !== "undefined") {
    return localStorage.getItem(AUTH_KEY) === "true"
  }
  return false
}

/**
 * Get current authenticated user (non-hook version)
 */
export function getAuthenticatedUser(): User | null {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(AUTH_USER_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return null
      }
    }
  }
  return null
}
