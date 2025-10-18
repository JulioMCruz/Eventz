import { validateUser, type User } from "./users"

const AUTH_KEY = "redirect_site_auth"
const AUTH_USER_KEY = "redirect_site_auth_user"

export function login(username: string, password: string): boolean {
  const user = validateUser(username, password)

  if (user) {
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_KEY, "true")
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
    }
    return true
  }

  return false
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_KEY)
    localStorage.removeItem(AUTH_USER_KEY)
  }
}

export function isAuthenticated(): boolean {
  if (typeof window !== "undefined") {
    return localStorage.getItem(AUTH_KEY) === "true"
  }
  return false
}

export function getCurrentUser(): User | null {
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
