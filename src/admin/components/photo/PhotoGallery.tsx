import { useState, useEffect, useRef, useCallback } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../lib/db.ts'
import type { InspectionPhoto } from '../../types/inspection.ts'
import { PhotoCapture } from './PhotoCapture.tsx'
import { PhotoAnnotator } from './PhotoAnnotator.tsx'

const TYPE_BADGES: Record<
  string,
  { label: string; color: string }
> = {
  visible: { label: 'Latható', color: 'bg-blue-500' },
  thermal: { label: 'Hőkamera', color: 'bg-red-500' },
  other: { label: 'Egyéb', color: 'bg-gray-500' },
}

interface PhotoGalleryProps {
  inspectionId: string
  stepKey: string
  roomId?: string
  defaultPhotoType?: 'visible' | 'thermal' | 'other'
}

export function PhotoGallery({
  inspectionId,
  stepKey,
  roomId,
  defaultPhotoType,
}: PhotoGalleryProps) {
  const [editingPhoto, setEditingPhoto] = useState<InspectionPhoto | null>(null)

  const photos = useLiveQuery(
    () =>
      db.photos
        .where('[inspectionId+stepKey]')
        .equals([inspectionId, stepKey])
        .toArray()
        .then((results) =>
          roomId ? results.filter((p) => p.roomId === roomId) : results
        ),
    [inspectionId, stepKey, roomId]
  )

  const handleDelete = async (photoId: string) => {
    await db.photos.delete(photoId)
  }

  const handleAnnotationSave = useCallback(() => {
    setEditingPhoto(null)
  }, [])

  const handleAnnotationClose = useCallback(() => {
    setEditingPhoto(null)
  }, [])

  // Group photos by type when no roomId filter
  const groupedPhotos = !roomId && photos
    ? photos.reduce(
        (acc, photo) => {
          const type = photo.photoType
          if (!acc[type]) acc[type] = []
          acc[type].push(photo)
          return acc
        },
        {} as Record<string, InspectionPhoto[]>
      )
    : null

  return (
    <div className="space-y-4">
      <PhotoCapture
        inspectionId={inspectionId}
        stepKey={stepKey}
        roomId={roomId}
        defaultPhotoType={defaultPhotoType}
      />

      {/* Photo gallery */}
      {!photos || photos.length === 0 ? (
        <p className="py-6 text-center text-sm text-stone-400">
          Meg nincsenek fenykepek
        </p>
      ) : groupedPhotos ? (
        // Grouped by photo type
        Object.entries(groupedPhotos).map(([type, typePhotos]) => (
          <div key={type} className="space-y-2">
            <h4 className="text-sm font-medium text-stone-400">
              {TYPE_BADGES[type]?.label ?? type}
            </h4>
            <ThumbnailGrid
              photos={typePhotos}
              onEdit={setEditingPhoto}
              onDelete={handleDelete}
            />
          </div>
        ))
      ) : (
        // Flat list (room-scoped)
        <ThumbnailGrid
          photos={photos}
          onEdit={setEditingPhoto}
          onDelete={handleDelete}
        />
      )}

      {/* Annotation modal */}
      {editingPhoto && (
        <PhotoAnnotator
          photo={editingPhoto}
          onSave={handleAnnotationSave}
          onClose={handleAnnotationClose}
        />
      )}
    </div>
  )
}

// --- Thumbnail Grid ---

interface ThumbnailGridProps {
  photos: InspectionPhoto[]
  onEdit: (photo: InspectionPhoto) => void
  onDelete: (photoId: string) => void
}

function ThumbnailGrid({ photos, onEdit, onDelete }: ThumbnailGridProps) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {photos.map((photo) => (
        <PhotoThumbnail
          key={photo.id}
          photo={photo}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

// --- Individual Thumbnail ---

interface PhotoThumbnailProps {
  photo: InspectionPhoto
  onEdit: (photo: InspectionPhoto) => void
  onDelete: (photoId: string) => void
}

function PhotoThumbnail({ photo, onEdit, onDelete }: PhotoThumbnailProps) {
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
    <div className="group relative overflow-hidden rounded-lg bg-stone-800">
      <button
        type="button"
        onClick={() => onEdit(photo)}
        className="block aspect-square w-full"
      >
        <img
          ref={imgRef}
          alt=""
          className="h-full w-full object-cover"
        />
      </button>

      {/* Type badge */}
      {badge && (
        <span
          className={`absolute left-1 top-1 rounded px-1.5 py-0.5 text-xs font-medium text-white ${badge.color}`}
        >
          {badge.label}
        </span>
      )}

      {/* Delete button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onDelete(photo.id)
        }}
        className="absolute right-1 top-1 rounded bg-red-600/80 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
      >
        <svg
          className="h-3.5 w-3.5"
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
    </div>
  )
}
