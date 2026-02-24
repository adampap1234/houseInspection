import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import imageCompression from 'browser-image-compression'
import { db } from '../lib/db.ts'
import type { InspectionPhoto } from '../types/inspection.ts'

/**
 * Hook for capturing, compressing, and storing inspection photos in IndexedDB.
 */
export function usePhotoCapture(
  inspectionId: string,
  stepKey: string,
  roomId?: string
) {
  const [isCompressing, setIsCompressing] = useState(false)

  const handleCapture = async (
    file: File,
    photoType: 'visible' | 'thermal' | 'other'
  ) => {
    setIsCompressing(true)
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.8,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      })

      const photo: InspectionPhoto = {
        id: uuidv4(),
        inspectionId,
        stepKey,
        roomId,
        photoType,
        blob: compressed,
        createdAt: new Date(),
        syncStatus: 'pending',
      }

      await db.photos.add(photo)
    } finally {
      setIsCompressing(false)
    }
  }

  const deletePhoto = async (photoId: string) => {
    await db.photos.delete(photoId)
  }

  return { handleCapture, deletePhoto, isCompressing }
}
