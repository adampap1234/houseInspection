import { useEffect, useRef, useState, useCallback } from 'react'
import {
  MarkerArea,
  Renderer,
  ArrowMarker,
  EllipseFrameMarker,
  TextMarker,
  ArrowMarkerEditor,
  ShapeOutlineMarkerEditor,
  TextMarkerEditor,
  type AnnotationState,
} from '@markerjs/markerjs3'
import { db } from '../../lib/db.ts'
import type { InspectionPhoto } from '../../types/inspection.ts'

interface PhotoAnnotatorProps {
  photo: InspectionPhoto
  onSave: () => void
  onClose: () => void
}

export function PhotoAnnotator({
  photo,
  onSave,
  onClose,
}: PhotoAnnotatorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const markerAreaRef = useRef<MarkerArea | null>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const objectUrlRef = useRef<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isReady, setIsReady] = useState(false)

  // Initialize marker area once the image loads
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Create object URL from photo blob
    const url = URL.createObjectURL(photo.blob)
    objectUrlRef.current = url

    // Create image element
    const img = document.createElement('img')
    img.src = url
    imgRef.current = img

    img.onload = () => {
      // Create and configure marker area (it is an HTMLElement / web component)
      const markerArea = new MarkerArea()
      markerArea.targetImage = img
      markerArea.autoZoomIn = true
      markerArea.autoZoomOut = true

      // Register marker types with their editors
      markerArea.registerMarkerType(ArrowMarker, ArrowMarkerEditor)
      markerArea.registerMarkerType(
        EllipseFrameMarker,
        ShapeOutlineMarkerEditor
      )
      markerArea.registerMarkerType(TextMarker, TextMarkerEditor)

      // Style the marker area container
      markerArea.style.width = '100%'
      markerArea.style.height = '100%'

      container.appendChild(markerArea)
      markerAreaRef.current = markerArea

      // Restore previous annotation state if it exists
      if (photo.annotationData) {
        try {
          const state = JSON.parse(photo.annotationData) as AnnotationState
          markerArea.addEventListener('areainit', () => {
            markerArea.restoreState(state)
          })
        } catch {
          // Ignore invalid annotation data
        }
      }

      setIsReady(true)
    }

    return () => {
      // Clean up marker area and object URL
      if (markerAreaRef.current && container.contains(markerAreaRef.current)) {
        container.removeChild(markerAreaRef.current)
      }
      markerAreaRef.current = null
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
        objectUrlRef.current = null
      }
    }
  }, [photo])

  const handleCreateMarker = useCallback((markerType: string) => {
    markerAreaRef.current?.createMarker(markerType)
  }, [])

  const handleSave = useCallback(async () => {
    const markerArea = markerAreaRef.current
    const img = imgRef.current
    if (!markerArea || !img) return

    setIsSaving(true)
    try {
      // Get annotation state for future editing
      const state = markerArea.getState()

      // Render annotations onto image
      const renderer = new Renderer()
      renderer.targetImage = img
      renderer.naturalSize = true
      renderer.imageType = 'image/jpeg'
      renderer.imageQuality = 0.85

      const dataUrl = await renderer.rasterize(state)

      // Convert data URL to blob
      const response = await fetch(dataUrl)
      const annotatedBlob = await response.blob()

      // Update photo in IndexedDB
      await db.photos.update(photo.id, {
        blob: annotatedBlob,
        annotationData: JSON.stringify(state),
      })

      onSave()
    } finally {
      setIsSaving(false)
    }
  }, [photo.id, onSave])

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-stone-900/95">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-stone-700 bg-stone-800 px-4 py-3">
        <div className="flex gap-2">
          <button
            type="button"
            disabled={!isReady}
            onClick={() => handleCreateMarker('ArrowMarker')}
            className="rounded-md bg-stone-700 px-3 py-1.5 text-sm font-medium text-stone-200 transition-colors hover:bg-stone-600 disabled:opacity-50"
          >
            <span className="flex items-center gap-1.5">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
              Nyil
            </span>
          </button>
          <button
            type="button"
            disabled={!isReady}
            onClick={() => handleCreateMarker('EllipseFrameMarker')}
            className="rounded-md bg-stone-700 px-3 py-1.5 text-sm font-medium text-stone-200 transition-colors hover:bg-stone-600 disabled:opacity-50"
          >
            <span className="flex items-center gap-1.5">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <circle cx="12" cy="12" r="9" />
              </svg>
              Kor
            </span>
          </button>
          <button
            type="button"
            disabled={!isReady}
            onClick={() => handleCreateMarker('TextMarker')}
            className="rounded-md bg-stone-700 px-3 py-1.5 text-sm font-medium text-stone-200 transition-colors hover:bg-stone-600 disabled:opacity-50"
          >
            <span className="flex items-center gap-1.5">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 8h10M7 12h4m1 8-4-4H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3l-4 4Z"
                />
              </svg>
              Szoveg
            </span>
          </button>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-stone-700 px-4 py-1.5 text-sm font-medium text-stone-200 transition-colors hover:bg-stone-600"
          >
            Megse
          </button>
          <button
            type="button"
            disabled={isSaving || !isReady}
            onClick={handleSave}
            className="rounded-md bg-amber-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-amber-500 disabled:opacity-50"
          >
            {isSaving ? 'Mentes...' : 'Mentes'}
          </button>
        </div>
      </div>

      {/* Annotation canvas */}
      <div ref={containerRef} className="flex-1 overflow-auto bg-stone-950" />
    </div>
  )
}
