import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
  type DocumentData,
} from "firebase/firestore"
import { db } from "./firebase"

export interface User {
  id: string
  walletAddress: string
  email?: string
  role: "admin" | "user"
  createdAt: string
  lastLogin?: string
}

const USERS_COLLECTION = "users"

/**
 * Convert Firestore document to User
 */
function docToUser(id: string, data: DocumentData): User {
  return {
    id,
    walletAddress: data.walletAddress,
    email: data.email,
    role: data.role || "user",
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
    lastLogin: data.lastLogin instanceof Timestamp ? data.lastLogin.toDate().toISOString() : data.lastLogin,
  }
}

/**
 * Get all users from Firestore
 */
export async function getUsersFromFirestore(): Promise<User[]> {
  try {
    const usersRef = collection(db, USERS_COLLECTION)
    const snapshot = await getDocs(usersRef)

    return snapshot.docs.map((doc) => docToUser(doc.id, doc.data()))
  } catch (error) {
    console.error("Error fetching users from Firestore:", error)
    return []
  }
}

/**
 * Get user by wallet address
 */
export async function getUserByWallet(walletAddress: string): Promise<User | null> {
  try {
    const usersRef = collection(db, USERS_COLLECTION)
    const q = query(usersRef, where("walletAddress", "==", walletAddress.toLowerCase()))
    const snapshot = await getDocs(q)

    if (!snapshot.empty) {
      const doc = snapshot.docs[0]
      return docToUser(doc.id, doc.data())
    }
    return null
  } catch (error) {
    console.error("Error fetching user by wallet:", error)
    return null
  }
}

/**
 * Create new user in Firestore
 */
export async function createUserInFirestore(userData: {
  walletAddress: string
  email?: string
  role?: "admin" | "user"
}): Promise<User> {
  try {
    const normalizedAddress = userData.walletAddress.toLowerCase()

    // Check if user already exists
    const existingUser = await getUserByWallet(normalizedAddress)
    if (existingUser) {
      throw new Error("User with this wallet address already exists")
    }

    const now = Timestamp.now()
    const userDoc = {
      walletAddress: normalizedAddress,
      email: userData.email,
      role: userData.role || "user",
      createdAt: now,
      lastLogin: now,
    }

    const docRef = await addDoc(collection(db, USERS_COLLECTION), userDoc)

    return {
      id: docRef.id,
      walletAddress: normalizedAddress,
      email: userData.email,
      role: userData.role || "user",
      createdAt: now.toDate().toISOString(),
      lastLogin: now.toDate().toISOString(),
    }
  } catch (error) {
    console.error("Error creating user in Firestore:", error)
    throw error
  }
}

/**
 * Update user in Firestore
 */
export async function updateUserInFirestore(
  id: string,
  updates: Partial<Omit<User, "id" | "createdAt">>,
): Promise<void> {
  try {
    const docRef = doc(db, USERS_COLLECTION, id)
    const updateData: any = { ...updates }

    // Normalize wallet address if provided
    if (updates.walletAddress) {
      updateData.walletAddress = updates.walletAddress.toLowerCase()
    }

    await updateDoc(docRef, updateData)
  } catch (error) {
    console.error("Error updating user in Firestore:", error)
    throw error
  }
}

/**
 * Delete user from Firestore
 */
export async function deleteUserFromFirestore(id: string): Promise<void> {
  try {
    const docRef = doc(db, USERS_COLLECTION, id)
    await deleteDoc(docRef)
  } catch (error) {
    console.error("Error deleting user from Firestore:", error)
    throw error
  }
}

/**
 * Update user's last login timestamp
 */
export async function updateLastLogin(walletAddress: string): Promise<void> {
  try {
    const user = await getUserByWallet(walletAddress)
    if (user) {
      const docRef = doc(db, USERS_COLLECTION, user.id)
      await updateDoc(docRef, {
        lastLogin: Timestamp.now(),
      })
    }
  } catch (error) {
    console.error("Error updating last login:", error)
  }
}

/**
 * Check if user is admin
 */
export async function isUserAdmin(walletAddress: string): Promise<boolean> {
  try {
    const user = await getUserByWallet(walletAddress)
    return user?.role === "admin"
  } catch (error) {
    console.error("Error checking admin status:", error)
    return false
  }
}
