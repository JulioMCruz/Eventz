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
  orderBy,
  Timestamp,
  type DocumentData,
} from "firebase/firestore"
import { db } from "./firebase"
import type { RedirectConfig } from "./config"

const EVENTS_COLLECTION = "events"

/**
 * Convert Firestore document to RedirectConfig
 */
function docToEvent(id: string, data: DocumentData): RedirectConfig {
  return {
    id,
    name: data.name,
    isDefault: data.isDefault || false,
    redirectUrl: data.redirectUrl,
    redirectMode: data.redirectMode,
    autoRedirectDelay: data.autoRedirectDelay,
    heroImage: data.heroImage,
    heroTitle: data.heroTitle,
    heroText: data.heroText,
    heroSlogan: data.heroSlogan,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt,
  }
}

/**
 * Get all events from Firestore
 */
export async function getEventsFromFirestore(): Promise<RedirectConfig[]> {
  try {
    const eventsRef = collection(db, EVENTS_COLLECTION)
    const q = query(eventsRef, orderBy("createdAt", "desc"))
    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => docToEvent(doc.id, doc.data()))
  } catch (error) {
    console.error("Error fetching events from Firestore:", error)
    return []
  }
}

/**
 * Get default event from Firestore
 */
export async function getDefaultEventFromFirestore(): Promise<RedirectConfig | null> {
  try {
    const eventsRef = collection(db, EVENTS_COLLECTION)
    const q = query(eventsRef, where("isDefault", "==", true))
    const snapshot = await getDocs(q)

    if (!snapshot.empty) {
      const doc = snapshot.docs[0]
      return docToEvent(doc.id, doc.data())
    }

    // If no default, return first event
    const allEvents = await getEventsFromFirestore()
    return allEvents[0] || null
  } catch (error) {
    console.error("Error fetching default event from Firestore:", error)
    return null
  }
}

/**
 * Get event by ID
 */
export async function getEventById(id: string): Promise<RedirectConfig | null> {
  try {
    const docRef = doc(db, EVENTS_COLLECTION, id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return docToEvent(docSnap.id, docSnap.data())
    }
    return null
  } catch (error) {
    console.error("Error fetching event by ID:", error)
    return null
  }
}

/**
 * Create new event in Firestore
 */
export async function createEventInFirestore(
  event: Omit<RedirectConfig, "id" | "createdAt" | "updatedAt">,
): Promise<RedirectConfig> {
  try {
    // If setting as default, unset all others
    if (event.isDefault) {
      await unsetAllDefaultEvents()
    }

    const now = Timestamp.now()
    const eventData = {
      ...event,
      createdAt: now,
      updatedAt: now,
    }

    const docRef = await addDoc(collection(db, EVENTS_COLLECTION), eventData)

    return {
      ...event,
      id: docRef.id,
      createdAt: now.toDate().toISOString(),
      updatedAt: now.toDate().toISOString(),
    }
  } catch (error) {
    console.error("Error creating event in Firestore:", error)
    throw error
  }
}

/**
 * Update event in Firestore
 */
export async function updateEventInFirestore(id: string, updates: Partial<RedirectConfig>): Promise<void> {
  try {
    // Prevent updating the default fallback event
    if (id === "default") {
      throw new Error("Cannot update the default fallback event. Please create a new event instead.")
    }

    // If setting as default, unset all others
    if (updates.isDefault) {
      await unsetAllDefaultEvents()
    }

    const docRef = doc(db, EVENTS_COLLECTION, id)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error("Error updating event in Firestore:", error)
    throw error
  }
}

/**
 * Delete event from Firestore
 */
export async function deleteEventFromFirestore(id: string): Promise<void> {
  try {
    // Prevent deleting the default fallback event
    if (id === "default") {
      throw new Error("Cannot delete the default fallback event.")
    }

    const docRef = doc(db, EVENTS_COLLECTION, id)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      throw new Error("Event not found")
    }

    await deleteDoc(docRef)

    // If deleted event was default, set first remaining event as default
    if (docSnap.data().isDefault) {
      const events = await getEventsFromFirestore()
      if (events.length > 0) {
        await updateEventInFirestore(events[0].id, { isDefault: true })
      }
    }
  } catch (error) {
    console.error("Error deleting event from Firestore:", error)
    throw error
  }
}

/**
 * Set event as default
 */
export async function setDefaultEventInFirestore(id: string): Promise<void> {
  try {
    await unsetAllDefaultEvents()
    const docRef = doc(db, EVENTS_COLLECTION, id)
    await updateDoc(docRef, {
      isDefault: true,
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error("Error setting default event:", error)
    throw error
  }
}

/**
 * Unset all default events
 */
async function unsetAllDefaultEvents(): Promise<void> {
  const eventsRef = collection(db, EVENTS_COLLECTION)
  const q = query(eventsRef, where("isDefault", "==", true))
  const snapshot = await getDocs(q)

  const updatePromises = snapshot.docs.map((doc) =>
    updateDoc(doc.ref, {
      isDefault: false,
      updatedAt: Timestamp.now(),
    }),
  )

  await Promise.all(updatePromises)
}
