import { useRef, useState, type ChangeEvent } from 'react'
import { PhotoTypeSelector } from './PhotoTypeSelector.tsx'
import { usePhotoCapture } from '../../hooks/usePhotoCapture.ts'

interface PhotoCaptureProps {
  inspectionId: string
  stepKey: string
  roomId?: string
  defaultPhotoType?: 'visible' | 'thermal' | 'other'
}

export function PhotoCapture({
  inspectionId,
  stepKey,
  roomId,
  defaultPhotoType = 'visible',
}: PhotoCaptureProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [photoType, setPhotoType] = useState<'visible' | 'thermal' | 'other'>(
    defaultPhotoType
  )

  const { handleCapture, isCompressing } = usePhotoCapture(
    inspectionId,
    stepKey,
    roomId
  )

  const onFileSelected = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    await handleCapture(file, photoType)
    // Reset input so the same file can be re-selected
    e.target.value = ''
  }

  return (
    <div className="space-y-3">
      <PhotoTypeSelector value={photoType} onChange={setPhotoType} />

      <div className="flex gap-2">
        {/* Camera capture (mobile devices) */}
        <button
          type="button"
          disabled={isCompressing}
          onClick={() => cameraInputRef.current?.click()}
          className="flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-500 disabled:opacity-50"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z"
            />
          </svg>
          Fenykep keszitese
        </button>

        {/* File import (SD card, gallery) */}
        <button
          type="button"
          disabled={isCompressing}
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 rounded-lg bg-stone-700 px-4 py-2.5 text-sm font-medium text-stone-200 transition-colors hover:bg-stone-600 disabled:opacity-50"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
            />
          </svg>
          Fajl importalasa
        </button>
      </div>

      {/* Compression spinner */}
      {isCompressing && (
        <div className="flex items-center gap-2 text-sm text-amber-400">
          <svg
            className="h-4 w-4 animate-spin"
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
          Kep tomoritese...
        </div>
      )}

      {/* Hidden file inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onFileSelected}
        className="hidden"
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onFileSelected}
        className="hidden"
      />
    </div>
  )
}
