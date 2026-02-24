import { useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../lib/db.ts'
import { useInspectionStore } from '../../stores/inspectionStore.ts'
import { AdminLayout } from '../layout/AdminLayout.tsx'
import { SectionSummaryCard } from './SectionSummaryCard.tsx'
import { PhotoSummaryGrid } from './PhotoSummaryGrid.tsx'
import { RiskOverridePanel } from './RiskOverridePanel.tsx'
import type { Inspection, RiskScore, CostItem } from '../../types/inspection.ts'

/**
 * Step configuration: maps step index to the data key on Inspection
 * and a Hungarian title for display.
 */
const STEP_CONFIG: {
  key: string
  title: string
  dataKey: keyof Inspection
}[] = [
  { key: 'project', title: 'Projekt adatok', dataKey: 'projectData' },
  { key: 'exterior', title: 'Kulso allapot', dataKey: 'exterior' },
  { key: 'wallStructure', title: 'Fal / szerkezet', dataKey: 'wallStructure' },
  { key: 'moisture', title: 'Nedvesseg / Penesz', dataKey: 'moisture' },
  { key: 'thermal', title: 'Hokamera', dataKey: 'thermal' },
  { key: 'windowsDoors', title: 'Nyilaszarok', dataKey: 'windowsDoors' },
  { key: 'electrical', title: 'Elektromos', dataKey: 'electrical' },
  { key: 'hvac', title: 'Futes / Klima', dataKey: 'hvac' },
  { key: 'laser', title: 'Lezermeresek', dataKey: 'laser' },
  { key: 'risks', title: 'Kockazatertekeles', dataKey: 'risks' },
  { key: 'costItems', title: 'Koltsegbecsles', dataKey: 'costItems' },
]

/**
 * Format a number in Hungarian style with space as thousands separator.
 */
function formatHuf(value: number): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export function InspectionSummary() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const setStep = useInspectionStore((s) => s.setStep)

  const inspection = useLiveQuery(
    () => (id ? db.inspections.get(id) : undefined),
    [id]
  )

  const handleEditStep = useCallback(
    (stepIndex: number) => {
      if (!id) return
      setStep(stepIndex)
      navigate(`/admin/inspection/${id}`)
    },
    [id, navigate, setStep]
  )

  const handleUpdateRisks = useCallback(
    async (updatedRisks: RiskScore[]) => {
      if (!id) return
      try {
        await db.inspections
          .where('id')
          .equals(id)
          .modify((record) => {
            record.risks = updatedRisks
            record.updatedAt = new Date()
          })
      } catch {
        // Silently fail
      }
    },
    [id]
  )

  // Loading state
  if (inspection === undefined) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12 text-stone-400">
          <p>Betoltese...</p>
        </div>
      </AdminLayout>
    )
  }

  // Not found
  if (!inspection) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-12 text-stone-400">
          <p className="text-lg">Inspekcio nem talalhato</p>
        </div>
      </AdminLayout>
    )
  }

  // Calculate cost totals
  const selectedCosts = (inspection.costItems ?? []).filter(
    (item: CostItem) => item.selected
  )
  const totalMin = selectedCosts.reduce(
    (sum: number, item: CostItem) => sum + item.minCostHuf,
    0
  )
  const totalMax = selectedCosts.reduce(
    (sum: number, item: CostItem) => sum + item.maxCostHuf,
    0
  )

  return (
    <AdminLayout>
      <div className="mx-auto max-w-4xl space-y-6 pb-12">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-stone-100">
            Inspekcio osszefoglalas
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-stone-400">
            {inspection.projectData.clientName && (
              <span>{inspection.projectData.clientName}</span>
            )}
            {inspection.projectData.address && (
              <>
                <span className="text-stone-600">|</span>
                <span>{inspection.projectData.address}</span>
              </>
            )}
            {inspection.projectData.date && (
              <>
                <span className="text-stone-600">|</span>
                <span>{inspection.projectData.date}</span>
              </>
            )}
          </div>
        </div>

        {/* Back to form button */}
        <button
          type="button"
          onClick={() => navigate(`/admin/inspection/${id}`)}
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
          Vissza az urlaphoz
        </button>

        {/* Section summary cards */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-stone-200">
            Vizsgalati szekciok
          </h2>

          {STEP_CONFIG.map((step, index) => {
            const rawData = inspection[step.dataKey]

            // For arrays (risks, costItems), show a summary object
            if (step.dataKey === 'risks') {
              const riskData = (rawData as RiskScore[]) ?? []
              return (
                <SectionSummaryCard
                  key={step.key}
                  title={step.title}
                  stepIndex={index}
                  data={{
                    'Kockazatok szama': riskData.length,
                    'Kockazatos': riskData.filter(
                      (r) => r.level === 'kockazatos'
                    ).length,
                    'Figyelendo': riskData.filter(
                      (r) => r.level === 'figyelendo'
                    ).length,
                    'Rendben': riskData.filter(
                      (r) => r.level === 'rendben'
                    ).length,
                    'Felulbiralt': riskData.filter(
                      (r) => r.manuallyAdjusted
                    ).length,
                  }}
                  onEdit={handleEditStep}
                />
              )
            }

            if (step.dataKey === 'costItems') {
              const costData = (rawData as CostItem[]) ?? []
              const selected = costData.filter((c) => c.selected)
              return (
                <SectionSummaryCard
                  key={step.key}
                  title={step.title}
                  stepIndex={index}
                  data={{
                    'Kijelolt tetelek': selected.length,
                    'Osszes tetel': costData.length,
                    'Becsult minimum': selected.length > 0
                      ? `${formatHuf(Math.round(selected.reduce((s, c) => s + c.minCostHuf, 0) / 1000))} ezer Ft`
                      : '-',
                    'Becsult maximum': selected.length > 0
                      ? `${formatHuf(Math.round(selected.reduce((s, c) => s + c.maxCostHuf, 0) / 1000))} ezer Ft`
                      : '-',
                  }}
                  onEdit={handleEditStep}
                />
              )
            }

            // For regular data objects, pass directly
            const data =
              rawData && typeof rawData === 'object' && !Array.isArray(rawData)
                ? (rawData as unknown as Record<string, unknown>)
                : {}

            return (
              <SectionSummaryCard
                key={step.key}
                title={step.title}
                stepIndex={index}
                data={data}
                onEdit={handleEditStep}
              />
            )
          })}
        </div>

        {/* Photo gallery */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-stone-200">
            Fenykepek
          </h2>
          <PhotoSummaryGrid inspectionId={inspection.id} />
        </div>

        {/* Risk override panel */}
        <RiskOverridePanel
          inspection={inspection}
          onUpdateRisks={handleUpdateRisks}
        />

        {/* Cost estimation total */}
        <div className="rounded-xl border border-amber-700/50 bg-amber-900/20 p-5">
          <h3 className="text-lg font-semibold text-stone-100">
            Becsult osszkoltseg
          </h3>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-stone-300">
              {selectedCosts.length} kijelolt tetel
            </span>
            <span className="text-xl font-bold text-amber-400">
              {selectedCosts.length === 0
                ? '-'
                : `${formatHuf(Math.round(totalMin / 1000))} - ${formatHuf(
                    Math.round(totalMax / 1000)
                  )} ezer Ft`}
            </span>
          </div>
        </div>

        {/* PDF generation button (placeholder) */}
        <div className="flex justify-center pt-4">
          <button
            type="button"
            disabled
            className="min-h-[48px] rounded-xl bg-amber-600 px-8 py-3 text-base font-semibold text-white opacity-50 cursor-not-allowed"
          >
            PDF generalas
          </button>
          <p className="ml-4 self-center text-xs text-stone-500">
            Hamarosan elerheto
          </p>
        </div>
      </div>
    </AdminLayout>
  )
}
