import { db } from './db.ts'
import { supabase } from './supabase.ts'

type SyncState = 'idle' | 'syncing' | 'error'

let syncInterval: ReturnType<typeof setInterval> | null = null
let onlineHandler: (() => void) | null = null
let currentSyncState: SyncState = 'idle'
const syncStateListeners = new Set<(state: SyncState) => void>()

function setSyncState(state: SyncState) {
  currentSyncState = state
  syncStateListeners.forEach((fn) => fn(state))
}

export function getSyncState(): SyncState {
  return currentSyncState
}

export function onSyncStateChange(fn: (state: SyncState) => void): () => void {
  syncStateListeners.add(fn)
  return () => {
    syncStateListeners.delete(fn)
  }
}

/**
 * Check if Supabase is configured with real credentials (not placeholder).
 */
function isSupabaseConfigured(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
  return Boolean(url && key && !url.includes('placeholder'))
}

/**
 * Sync a single inspection to Supabase.
 * Non-blocking -- never throws.
 */
export async function syncInspection(inspectionId: string): Promise<void> {
  if (!isSupabaseConfigured()) return
  if (!navigator.onLine) return

  try {
    // Attempt silent token refresh
    await supabase.auth.refreshSession()

    const inspection = await db.inspections.get(inspectionId)
    if (!inspection || inspection.syncStatus !== 'pending') return

    // Upsert inspection data (excluding photo blobs)
    const { id, createdAt, updatedAt, syncStatus, ...inspectionData } = inspection
    const { error: upsertError } = await supabase
      .from('inspections')
      .upsert({
        id,
        ...inspectionData,
        created_at: createdAt instanceof Date ? createdAt.toISOString() : createdAt,
        updated_at: updatedAt instanceof Date ? updatedAt.toISOString() : updatedAt,
      })

    if (upsertError) {
      console.warn('[Sync] Inspection upsert failed:', upsertError.message)
      await db.inspections
        .where('id')
        .equals(inspectionId)
        .modify({ syncStatus: 'error' })
      return
    }

    // Mark inspection as synced
    await db.inspections
      .where('id')
      .equals(inspectionId)
      .modify({ syncStatus: 'synced' })

    // Sync pending photos for this inspection
    const pendingPhotos = await db.photos
      .where('inspectionId')
      .equals(inspectionId)
      .filter((p) => p.syncStatus === 'pending')
      .toArray()

    for (const photo of pendingPhotos) {
      try {
        const storagePath = `${inspectionId}/${photo.stepKey}/${photo.id}.jpg`

        const { error: uploadError } = await supabase.storage
          .from('inspection-photos')
          .upload(storagePath, photo.blob, {
            contentType: 'image/jpeg',
            upsert: true,
          })

        if (uploadError) {
          console.warn('[Sync] Photo upload failed:', uploadError.message)
          await db.photos
            .where('id')
            .equals(photo.id)
            .modify({ syncStatus: 'error' })
          continue
        }

        // Mark photo as synced
        await db.photos
          .where('id')
          .equals(photo.id)
          .modify({ syncStatus: 'synced' })
      } catch (photoErr) {
        console.warn('[Sync] Photo sync error:', photoErr)
        await db.photos
          .where('id')
          .equals(photo.id)
          .modify({ syncStatus: 'error' })
      }
    }
  } catch (err) {
    console.warn('[Sync] Inspection sync error:', err)
    try {
      await db.inspections
        .where('id')
        .equals(inspectionId)
        .modify({ syncStatus: 'error' })
    } catch {
      // Silently fail
    }
  }
}

/**
 * Sync all pending inspections and photos.
 */
export async function syncAll(): Promise<void> {
  if (!isSupabaseConfigured()) return
  if (!navigator.onLine) return

  setSyncState('syncing')

  try {
    const pendingInspections = await db.inspections
      .where('syncStatus')
      .equals('pending')
      .toArray()

    for (const inspection of pendingInspections) {
      await syncInspection(inspection.id)
    }

    // Also sync any photos whose parent inspection is already synced but photo is still pending
    const orphanPhotos = await db.photos
      .where('syncStatus')
      .equals('pending')
      .toArray()

    if (orphanPhotos.length > 0) {
      // Attempt silent token refresh once
      await supabase.auth.refreshSession()

      for (const photo of orphanPhotos) {
        try {
          const storagePath = `${photo.inspectionId}/${photo.stepKey}/${photo.id}.jpg`

          const { error: uploadError } = await supabase.storage
            .from('inspection-photos')
            .upload(storagePath, photo.blob, {
              contentType: 'image/jpeg',
              upsert: true,
            })

          if (uploadError) {
            await db.photos
              .where('id')
              .equals(photo.id)
              .modify({ syncStatus: 'error' })
            continue
          }

          await db.photos
            .where('id')
            .equals(photo.id)
            .modify({ syncStatus: 'synced' })
        } catch {
          await db.photos
            .where('id')
            .equals(photo.id)
            .modify({ syncStatus: 'error' })
        }
      }
    }

    // Check if any errors remain
    const errorCount = await db.inspections
      .where('syncStatus')
      .equals('error')
      .count()
    const photoErrorCount = await db.photos
      .where('syncStatus')
      .equals('error')
      .count()

    setSyncState(errorCount + photoErrorCount > 0 ? 'error' : 'idle')
  } catch (err) {
    console.warn('[Sync] syncAll error:', err)
    setSyncState('error')
  }
}

/**
 * Start background sync with 60-second interval and online event listener.
 */
export function startBackgroundSync(): void {
  // Avoid duplicate intervals
  if (syncInterval) return

  syncInterval = setInterval(() => {
    void syncAll()
  }, 60_000)

  onlineHandler = () => {
    void syncAll()
  }
  window.addEventListener('online', onlineHandler)

  // Initial sync attempt
  void syncAll()
}

/**
 * Stop background sync.
 */
export function stopBackgroundSync(): void {
  if (syncInterval) {
    clearInterval(syncInterval)
    syncInterval = null
  }
  if (onlineHandler) {
    window.removeEventListener('online', onlineHandler)
    onlineHandler = null
  }
}
