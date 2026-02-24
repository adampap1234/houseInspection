import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { PDFViewer, pdf } from '@react-pdf/renderer'
import { db } from '../lib/db.ts'
import { blobToBase64 } from '../lib/blob-utils.ts'
import { AdminLayout } from '../components/layout/AdminLayout.tsx'
import { ReportDocument } from '../components/pdf/ReportDocument.tsx'
import type { PhotoWithBase64 } from '../components/pdf/FindingsPage.tsx'

export function ReportPreviewPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [photosBase64, setPhotosBase64] = useState<PhotoWithBase64[] | null>(
    null
  )
  const [converting, setConverting] = useState(true)
  const [downloading, setDownloading] = useState(false)

  const inspection = useLiveQuery(
    () => (id ? db.inspections.get(id) : undefined),
    [id]
  )

  const photos = useLiveQuery(
    () =>
      id
        ? db.photos.where('inspectionId').equals(id).toArray()
        : [],
    [id]
  )

  // Convert photo blobs to base64 for PDF rendering
  useEffect(() => {
    if (!photos || photos.length === 0) {
      setPhotosBase64([])
      setConverting(false)
      return
    }

    let cancelled = false

    async function convert() {
      try {
        const results: PhotoWithBase64[] = await Promise.all(
          photos!.map(async (photo) => {
            const base64 = await blobToBase64(photo.blob)
            return {
              id: photo.id,
              inspectionId: photo.inspectionId,
              stepKey: photo.stepKey,
              roomId: photo.roomId,
              photoType: photo.photoType,
              annotationData: photo.annotationData,
              createdAt: photo.createdAt,
              syncStatus: photo.syncStatus,
              base64,
            }
          })
        )
        if (!cancelled) {
          setPhotosBase64(results)
          setConverting(false)
        }
      } catch {
        if (!cancelled) {
          setPhotosBase64([])
          setConverting(false)
        }
      }
    }

    convert()
    return () => {
      cancelled = true
    }
  }, [photos])

  const handleDownload = useCallback(async () => {
    if (!inspection || !photosBase64) return
    setDownloading(true)

    try {
      const risks = inspection.risks ?? []
      const blob = await pdf(
        <ReportDocument
          inspection={inspection}
          photos={photosBase64}
          risks={risks}
        />
      ).toBlob()

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `inspekcio-${inspection.projectData.clientName || inspection.id}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('PDF download failed:', err)
    } finally {
      setDownloading(false)
    }
  }, [inspection, photosBase64])

  // Loading state
  if (inspection === undefined || converting) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-20 text-stone-400">
          <svg
            className="h-8 w-8 animate-spin text-amber-500"
            viewBox="0 0 24 24"
            fill="none"
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
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="mt-3 text-sm">
            {converting
              ? 'Fenykepek feldolgozasa...'
              : 'Betoltese...'}
          </p>
        </div>
      </AdminLayout>
    )
  }

  // Not found
  if (!inspection) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-20 text-stone-400">
          <p className="text-lg">Inspekcio nem talalhato</p>
        </div>
      </AdminLayout>
    )
  }

  const risks = inspection.risks ?? []

  return (
    <AdminLayout>
      <div className="mx-auto max-w-6xl space-y-4 pb-8">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate(`/admin/inspection/${id}/summary`)}
            className="inline-flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300"
          >
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
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
            Vissza az osszegzeshez
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-amber-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-500 disabled:opacity-50"
          >
            {downloading ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
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
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Generalas...
              </>
            ) : (
              <>
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
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
                PDF letoltese
              </>
            )}
          </button>
        </div>

        {/* PDF Preview */}
        <div
          className="overflow-hidden rounded-xl border border-stone-700 bg-stone-900"
          style={{ height: 'calc(100vh - 180px)' }}
        >
          <PDFViewer width="100%" height="100%" showToolbar={false}>
            <ReportDocument
              inspection={inspection}
              photos={photosBase64 ?? []}
              risks={risks}
            />
          </PDFViewer>
        </div>
      </div>
    </AdminLayout>
  )
}
