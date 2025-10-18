import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { app } from "./firebase"

const storage = getStorage(app)

/**
 * Upload an image to Firebase Storage
 * @param file - The file to upload
 * @param path - The storage path (e.g., 'events/hero-images')
 * @returns The download URL of the uploaded file
 */
export async function uploadImage(file: File, path: string = "events/hero-images"): Promise<string> {
  const timestamp = Date.now()
  const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`
  const storageRef = ref(storage, `${path}/${fileName}`)

  await uploadBytes(storageRef, file)
  const downloadURL = await getDownloadURL(storageRef)

  return downloadURL
}

/**
 * Delete an image from Firebase Storage
 * @param url - The full download URL of the image to delete
 */
export async function deleteImage(url: string): Promise<void> {
  try {
    const storageRef = ref(storage, url)
    await deleteObject(storageRef)
  } catch (error) {
    console.error("Error deleting image:", error)
    throw error
  }
}

/**
 * Upload multiple images
 * @param files - Array of files to upload
 * @param path - Storage path
 * @returns Array of download URLs
 */
export async function uploadImages(files: File[], path: string = "events/images"): Promise<string[]> {
  const uploadPromises = files.map((file) => uploadImage(file, path))
  return Promise.all(uploadPromises)
}
