import { useEffect, useState, useCallback } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../lib/db.ts'
import { calculateRisks } from '../../lib/risk-engine.ts'
import { useInspectionStore } from '../../stores/inspectionStore.ts'
import { StepNavigation } from '../layout/StepNavigation.tsx'
import type { RiskScore, RiskLevel } from '../../types/inspection.ts'

interface RiskAssessmentStepProps {
  inspectionId: string
  defaultValues: RiskScore[]
}

const LEVEL_CONFIG: Record<
  RiskLevel,
  { label: string; badge: string; bg: string; border: string }
> = {
  rendben: {
    label: 'Rendben',
    badge: 'bg-green-600 text-white',
    bg: 'bg-green-900/20',
    border: 'border-green-700/50',
  },
  figyelendo: {
    label: 'Figyelendo',
    badge: 'bg-yellow-600 text-white',
    bg: 'bg-yellow-900/20',
    border: 'border-yellow-700/50',
  },
  kockazatos: {
    label: 'Kockazatos',
    badge: 'bg-red-600 text-white',
    bg: 'bg-red-900/20',
    border: 'border-red-700/50',
  },
}

const LEVEL_OPTIONS: RiskLevel[] = ['rendben', 'figyelendo', 'kockazatos']

const TOTAL_STEPS = 11

export function RiskAssessmentStep({
  inspectionId,
  defaultValues,
}: RiskAssessmentStepProps) {
  const [risks, setRisks] = useState<RiskScore[]>(defaultValues)
  const currentStep = useInspectionStore((s) => s.currentStep)
  const setStep = useInspectionStore((s) => s.setStep)

  // Load full inspection to calculate risks
  const inspection = useLiveQuery(
    () => db.inspections.get(inspectionId),
    [inspectionId]
  )

  // Auto-calculate risks on mount / when inspection data changes
  useEffect(() => {
    if (!inspection) return

    const autoRisks = calculateRisks(inspection)

    // Merge with any previously saved manual overrides
    if (inspection.risks && inspection.risks.length > 0) {
      const overrides = new Map(
        inspection.risks
          .filter((r) => r.manuallyAdjusted)
          .map((r) => [r.category + ':' + r.reason.split(':')[0], r])
      )

      const merged = autoRisks.map((risk) => {
        const key = risk.category + ':' + risk.reason.split(':')[0]
        const override = overrides.get(key)
        if (override) {
          return { ...risk, level: override.level, manuallyAdjusted: true }
        }
        return risk
      })

      setRisks(merged)
    } else {
      setRisks(autoRisks)
    }
  }, [inspection])

  // Auto-save to Dexie
  const saveRisks = useCallback(
    async (updatedRisks: RiskScore[]) => {
      try {
        await db.inspections
          .where('id')
          .equals(inspectionId)
          .modify((record) => {
            record.risks = updatedRisks
            record.updatedAt = new Date()
          })
      } catch {
        // Silently fail
      }
    },
    [inspectionId]
  )

  const handleLevelChange = (index: number, newLevel: RiskLevel) => {
    const updated = risks.map((risk, i) => {
      if (i === index) {
        return { ...risk, level: newLevel, manuallyAdjusted: true }
      }
      return risk
    })
    setRisks(updated)
    saveRisks(updated)
  }

  const handleNext = async () => {
    await saveRisks(risks)
    const nextStep = currentStep + 1
    await db.inspections.update(inspectionId, { currentStep: nextStep })
    setStep(nextStep)
  }

  const handlePrevious = async () => {
    await saveRisks(risks)
    const prevStep = currentStep - 1
    await db.inspections.update(inspectionId, { currentStep: prevStep })
    setStep(prevStep)
  }

  // Group risks by category
  const grouped = risks.reduce<Record<string, { risk: RiskScore; index: number }[]>>(
    (acc, risk, index) => {
      if (!acc[risk.category]) {
        acc[risk.category] = []
      }
      acc[risk.category]!.push({ risk, index })
      return acc
    },
    {}
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-stone-100">
          Kockazatertekeles osszefoglalo
        </h2>
        <p className="mt-1 text-sm text-stone-400">
          Automatikusan szamolt kockazatok az inspekcios adatok alapjan.
          Szukseges eseten felulbiralhato.
        </p>
      </div>

      {risks.length === 0 && (
        <div className="rounded-xl border border-stone-700 bg-stone-800 p-8 text-center text-stone-400">
          <p>Nincs elegendo adat a kockazatok szamitasahoz.</p>
          <p className="mt-1 text-sm">
            Toltse ki az elozo lepeseket a kockazatertekeleshez.
          </p>
        </div>
      )}

      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="space-y-2">
          <h3 className="text-lg font-medium text-stone-200">{category}</h3>
          <div className="space-y-2">
            {items.map(({ risk, index }) => {
              const config = LEVEL_CONFIG[risk.level]
              return (
                <div
                  key={risk.id}
                  className={`rounded-lg border ${config.border} ${config.bg} p-4`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Traffic light badge */}
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.badge}`}
                    >
                      {config.label}
                    </span>

                    {/* Auto badge */}
                    {risk.autoCalculated && !risk.manuallyAdjusted && (
                      <span className="inline-flex items-center rounded-full bg-stone-600 px-2.5 py-0.5 text-xs font-medium text-stone-200">
                        Auto
                      </span>
                    )}

                    {/* Modified badge */}
                    {risk.manuallyAdjusted && (
                      <span className="inline-flex items-center rounded-full bg-amber-600 px-2.5 py-0.5 text-xs font-medium text-white">
                        Modositott
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-sm text-stone-300">{risk.reason}</p>

                  {/* Level override dropdown */}
                  <div className="mt-3">
                    <label className="block text-xs text-stone-400 mb-1">
                      Szint felulbiralasa:
                    </label>
                    <select
                      value={risk.level}
                      onChange={(e) =>
                        handleLevelChange(
                          index,
                          e.target.value as RiskLevel
                        )
                      }
                      className="min-h-[44px] rounded-lg border border-stone-600 bg-stone-800 px-3 py-2 text-sm text-stone-200 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600"
                    >
                      {LEVEL_OPTIONS.map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {LEVEL_CONFIG[lvl].label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      <StepNavigation
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </div>
  )
}
