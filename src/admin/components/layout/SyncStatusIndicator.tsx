import { useState, useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../lib/db.ts'
import { getSyncState, onSyncStateChange, syncAll } from '../../lib/sync.ts'

export function SyncStatusIndicator() {
  const [syncState, setSyncState] = useState(getSyncState)
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  // Subscribe to sync state changes
  useEffect(() => {
    const unsub = onSyncStateChange(setSyncState)
    return unsub
  }, [])

  // Track online/offline
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Count pending items from Dexie
  const pendingCount = useLiveQuery(async () => {
    const pendingInspections = await db.inspections
      .where('syncStatus')
      .equals('pending')
      .count()
    const pendingPhotos = await db.photos
      .where('syncStatus')
      .equals('pending')
      .count()
    return pendingInspections + pendingPhotos
  }, [])

  const handleRetry = () => {
    void syncAll()
  }

  // Offline mode
  if (!isOnline) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-stone-500">
        <span className="h-2 w-2 rounded-full bg-stone-500" />
        <span>Offline mod</span>
      </div>
    )
  }

  // Currently syncing
  if (syncState === 'syncing') {
    return (
      <div className="flex items-center gap-1.5 text-xs text-amber-400">
        <svg
          className="h-3 w-3 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
        <span>Szinkronizalas...</span>
      </div>
    )
  }

  // Error state
  if (syncState === 'error') {
    return (
      <button
        type="button"
        onClick={handleRetry}
        className="flex items-center gap-1.5 text-xs text-red-400 transition-colors hover:text-red-300"
      >
        <span className="h-2 w-2 rounded-full bg-red-500" />
        <span>Szinkronizalasi hiba</span>
      </button>
    )
  }

  // Pending items
  if (pendingCount && pendingCount > 0) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-yellow-400">
        <span className="h-2 w-2 rounded-full bg-yellow-500" />
        <span>{pendingCount} elem szinkronizalasra var</span>
      </div>
    )
  }

  // All synced
  return (
    <div className="flex items-center gap-1.5 text-xs text-green-400">
      <span className="h-2 w-2 rounded-full bg-green-500" />
      <span>Szinkronizalva</span>
    </div>
  )
}
