import {
  getUsersFromFirestore,
  getUserByWallet,
  createUserInFirestore,
  updateUserInFirestore,
  deleteUserFromFirestore,
  isUserAdmin,
} from "./firestore-users"

export interface User {
  id: string
  walletAddress: string
  email?: string
  role: "admin" | "user"
  createdAt: string
  lastLogin?: string
}

/**
 * Get all users (now uses Firestore)
 */
export async function getUsers(): Promise<User[]> {
  try {
    return await getUsersFromFirestore()
  } catch (error) {
    console.error("Error loading users:", error)
    return []
  }
}

/**
 * Get user by wallet address
 */
export async function getUserByAddress(walletAddress: string): Promise<User | null> {
  try {
    return await getUserByWallet(walletAddress)
  } catch (error) {
    console.error("Error loading user:", error)
    return null
  }
}

/**
 * Create user (now uses Firestore)
 */
export async function createUser(userData: { walletAddress: string; email?: string; role?: "admin" | "user" }): Promise<User> {
  try {
    return await createUserInFirestore(userData)
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

/**
 * Update user (now uses Firestore)
 */
export async function updateUser(id: string, updates: Partial<Omit<User, "id" | "createdAt">>): Promise<void> {
  try {
    await updateUserInFirestore(id, updates)
  } catch (error) {
    console.error("Error updating user:", error)
    throw error
  }
}

/**
 * Delete user (now uses Firestore)
 */
export async function deleteUser(id: string): Promise<void> {
  try {
    await deleteUserFromFirestore(id)
  } catch (error) {
    console.error("Error deleting user:", error)
    throw error
  }
}

/**
 * Check if wallet address is admin
 */
export async function checkIsAdmin(walletAddress: string): Promise<boolean> {
  try {
    return await isUserAdmin(walletAddress)
  } catch (error) {
    console.error("Error checking admin status:", error)
    return false
  }
}
