import { useState, useEffect, useRef, useCallback } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../lib/db.ts'
import type { InspectionPhoto } from '../../types/inspection.ts'

const TYPE_BADGES: Record<string, { label: string; color: string }> = {
  visible: { label: 'Lathato', color: 'bg-blue-500' },
  thermal: { label: 'Hokamera', color: 'bg-red-500' },
  other: { label: 'Egyeb', color: 'bg-gray-500' },
}

interface PhotoSummaryGridProps {
  inspectionId: string
  stepKey?: string
}

export function PhotoSummaryGrid({
  inspectionId,
  stepKey,
}: PhotoSummaryGridProps) {
  const [lightboxPhoto, setLightboxPhoto] = useState<InspectionPhoto | null>(
    null
  )

  const photos = useLiveQuery(
    () => {
      if (stepKey) {
        return db.photos
          .where('[inspectionId+stepKey]')
          .equals([inspectionId, stepKey])
          .toArray()
      }
      return db.photos
        .where('inspectionId')
        .equals(inspectionId)
        .toArray()
    },
    [inspectionId, stepKey]
  )

  const closeLightbox = useCallback(() => {
    setLightboxPhoto(null)
  }, [])

  if (!photos) {
    return (
      <p className="py-4 text-center text-sm text-stone-500">Betoltese...</p>
    )
  }

  if (photos.length === 0) {
    return (
      <div className="rounded-xl border border-stone-700 bg-stone-800/50 p-6 text-center">
        <p className="text-sm text-stone-400">Nincs fenykep</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-stone-300">
          {photos.length} fenykep
        </h3>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
        {photos.map((photo) => (
          <SummaryThumbnail
            key={photo.id}
            photo={photo}
            onClick={() => setLightboxPhoto(photo)}
          />
        ))}
      </div>

      {/* Lightbox modal */}
      {lightboxPhoto && (
        <LightboxModal photo={lightboxPhoto} onClose={closeLightbox} />
      )}
    </div>
  )
}

// --- Thumbnail ---

interface SummaryThumbnailProps {
  photo: InspectionPhoto
  onClick: () => void
}

function SummaryThumbnail({ photo, onClick }: SummaryThumbnailProps) {
  const imgRef = useRef<HTMLImageElement>(null)
  const urlRef = useRef<string | null>(null)

  useEffect(() => {
    const url = URL.createObjectURL(photo.blob)
    urlRef.current = url
    if (imgRef.current) {
      imgRef.current.src = url
    }
    return () => {
      URL.revokeObjectURL(url)
      urlRef.current = null
    }
  }, [photo.blob])

  const badge = TYPE_BADGES[photo.photoType]

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative aspect-square overflow-hidden rounded-lg bg-stone-800"
    >
      <img
        ref={imgRef}
        alt=""
        className="h-full w-full object-cover transition-transform group-hover:scale-105"
      />
      {badge && (
        <span
          className={`absolute left-1 top-1 rounded px-1 py-0.5 text-[0.6rem] font-medium text-white ${badge.color}`}
        >
          {badge.label}
        </span>
      )}
    </button>
  )
}

// --- Lightbox ---

interface LightboxModalProps {
  photo: InspectionPhoto
  onClose: () => void
}

function LightboxModal({ photo, onClose }: LightboxModalProps) {
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const url = URL.createObjectURL(photo.blob)
    if (imgRef.current) {
      imgRef.current.src = url
    }
    return () => {
      URL.revokeObjectURL(url)
    }
  }, [photo.blob])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const badge = TYPE_BADGES[photo.photoType]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          ref={imgRef}
          alt=""
          className="max-h-[85vh] max-w-full rounded-lg object-contain"
        />

        {badge && (
          <span
            className={`absolute left-3 top-3 rounded px-2 py-1 text-xs font-medium text-white ${badge.color}`}
          >
            {badge.label}
          </span>
        )}

        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full bg-stone-900/80 p-2 text-white transition-colors hover:bg-stone-700"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="mt-2 text-center text-sm text-stone-400">
          {photo.stepKey}
          {photo.roomId && ` - ${photo.roomId}`}
        </div>
      </div>
    </div>
  )
}
