import { useEffect, useRef, useState } from 'react'
import type { FieldValues, UseFormWatch } from 'react-hook-form'
import { db } from '../lib/db.ts'
import type { Inspection } from '../types/inspection.ts'

/**
 * Debounced auto-save hook for react-hook-form.
 * Watches all field changes and persists to Dexie IndexedDB.
 */
export function useAutoSave<T extends FieldValues>(
  inspectionId: string,
  stepKey: keyof Inspection,
  watch: UseFormWatch<T>,
  debounceMs = 500
) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const subscription = watch((data) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(async () => {
        try {
          // Use Dexie's modify to avoid UpdateSpec type complexity with dynamic keys
          await db.inspections
            .where('id')
            .equals(inspectionId)
            .modify((record) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ;(record as any)[stepKey] = data
              record.updatedAt = new Date()
            })
          setLastSaved(new Date())
        } catch {
          // Silently fail on save errors -- IndexedDB may not be available
        }
      }, debounceMs)
    })

    return () => {
      subscription.unsubscribe()
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [inspectionId, stepKey, watch, debounceMs])

  return { lastSaved }
}
