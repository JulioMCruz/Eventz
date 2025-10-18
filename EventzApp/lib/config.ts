import {
  getEventsFromFirestore,
  getDefaultEventFromFirestore,
  createEventInFirestore,
  updateEventInFirestore,
  deleteEventFromFirestore,
  setDefaultEventInFirestore,
} from "./firestore-config"

export interface RedirectConfig {
  id: string
  name: string
  isDefault: boolean
  redirectUrl: string
  redirectMode: "auto" | "manual"
  autoRedirectDelay: number
  heroImage: string
  heroTitle: string
  heroText: string
  heroSlogan: string
  createdAt: string
  updatedAt: string
}

export const defaultEvent: RedirectConfig = {
  id: "default",
  name: "Default Event",
  isDefault: true,
  redirectUrl: "https://example.com",
  redirectMode: "manual",
  autoRedirectDelay: 5,
  heroImage: "/professional-business-meeting.png",
  heroTitle: "Welcome to Our Platform",
  heroText:
    "Discover amazing opportunities and connect with professionals worldwide. Join us today and transform your business.",
  heroSlogan: "Your Success Starts Here",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

/**
 * Get all events (now uses Firestore)
 */
export async function getEvents(): Promise<RedirectConfig[]> {
  try {
    const events = await getEventsFromFirestore()
    return events.length > 0 ? events : [defaultEvent]
  } catch (error) {
    console.error("Error loading events:", error)
    return [defaultEvent]
  }
}

/**
 * Get default event (now uses Firestore)
 */
export async function getDefaultEvent(): Promise<RedirectConfig> {
  try {
    const event = await getDefaultEventFromFirestore()
    return event || defaultEvent
  } catch (error) {
    console.error("Error loading default event:", error)
    return defaultEvent
  }
}

/**
 * Create event (now uses Firestore)
 */
export async function createEvent(
  event: Omit<RedirectConfig, "id" | "createdAt" | "updatedAt">,
): Promise<RedirectConfig> {
  try {
    return await createEventInFirestore(event)
  } catch (error) {
    console.error("Error creating event:", error)
    throw error
  }
}

/**
 * Update event (now uses Firestore)
 */
export async function updateEvent(id: string, updates: Partial<RedirectConfig>): Promise<void> {
  try {
    await updateEventInFirestore(id, updates)
  } catch (error) {
    console.error("Error updating event:", error)
    throw error
  }
}

/**
 * Delete event (now uses Firestore)
 */
export async function deleteEvent(id: string): Promise<void> {
  try {
    await deleteEventFromFirestore(id)
  } catch (error) {
    console.error("Error deleting event:", error)
    throw error
  }
}

/**
 * Set default event (now uses Firestore)
 */
export async function setDefaultEvent(id: string): Promise<void> {
  try {
    await setDefaultEventInFirestore(id)
  } catch (error) {
    console.error("Error setting default event:", error)
    throw error
  }
}
