import { useState, useEffect } from 'react'
import { calculateRisks } from '../../lib/risk-engine.ts'
import type { Inspection, RiskScore, RiskLevel } from '../../types/inspection.ts'

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

interface RiskOverridePanelProps {
  inspection: Inspection
  onUpdateRisks: (risks: RiskScore[]) => void
}

export function RiskOverridePanel({
  inspection,
  onUpdateRisks,
}: RiskOverridePanelProps) {
  const [risks, setRisks] = useState<RiskScore[]>([])
  const [autoRisks, setAutoRisks] = useState<Map<string, RiskScore>>(new Map())

  // Calculate auto risks and merge with overrides
  useEffect(() => {
    const calculated = calculateRisks(inspection)

    // Build a map of auto-calculated risks keyed by category:roomOrLabel
    const autoMap = new Map<string, RiskScore>()
    for (const risk of calculated) {
      const key = risk.category + ':' + risk.reason.split(':')[0]
      autoMap.set(key, risk)
    }
    setAutoRisks(autoMap)

    // Merge with existing overrides from inspection.risks
    if (inspection.risks && inspection.risks.length > 0) {
      const overrides = new Map(
        inspection.risks
          .filter((r) => r.manuallyAdjusted)
          .map((r) => [r.category + ':' + r.reason.split(':')[0], r])
      )

      const merged = calculated.map((risk) => {
        const key = risk.category + ':' + risk.reason.split(':')[0]
        const override = overrides.get(key)
        if (override) {
          return {
            ...risk,
            level: override.level,
            manuallyAdjusted: true,
            reason: override.reason,
          }
        }
        return risk
      })

      setRisks(merged)
    } else {
      setRisks(calculated)
    }
  }, [inspection])

  const handleLevelChange = (index: number, newLevel: RiskLevel) => {
    const updated = risks.map((risk, i) => {
      if (i === index) {
        return {
          ...risk,
          level: newLevel,
          manuallyAdjusted: true,
          reason: risk.reason + ' [felulbiralt]',
        }
      }
      return risk
    })
    setRisks(updated)
    onUpdateRisks(updated)
  }

  const handleRestoreOriginal = (index: number) => {
    const risk: RiskScore | undefined = risks[index]
    if (!risk) return

    const reasonPrefix = risk.reason.split(':')[0] ?? ''
    const key = risk.category + ':' + reasonPrefix.replace(' [felulbiralt]', '')
    const original = autoRisks.get(key)

    if (original) {
      const updated = risks.map((r, i) => {
        if (i === index) {
          return { ...original }
        }
        return r
      })
      setRisks(updated)
      onUpdateRisks(updated)
    }
  }

  // Group by category
  const grouped = risks.reduce<
    Record<string, { risk: RiskScore; index: number }[]>
  >((acc, risk, index) => {
    if (!acc[risk.category]) {
      acc[risk.category] = []
    }
    acc[risk.category]!.push({ risk, index })
    return acc
  }, {})

  if (risks.length === 0) {
    return (
      <div className="rounded-xl border border-stone-700 bg-stone-800/50 p-6 text-center">
        <p className="text-sm text-stone-400">
          Nincs elegendo adat a kockazatok szamitasahoz.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-stone-100">
          Kockazatertekeles
        </h3>
        <p className="mt-1 text-xs text-stone-400">
          Automatikusan szamolt kockazatok. Szukseges eseten felulbiralhato.
        </p>
      </div>

      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="space-y-2">
          <h4 className="text-sm font-medium text-stone-300">{category}</h4>
          <div className="space-y-2">
            {items.map(({ risk, index }) => {
              const config = LEVEL_CONFIG[risk.level]
              return (
                <div
                  key={risk.id}
                  className={`rounded-lg border ${config.border} ${config.bg} p-3`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Traffic light badge */}
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${config.badge}`}
                    >
                      {config.label}
                    </span>

                    {/* Auto badge */}
                    {risk.autoCalculated && !risk.manuallyAdjusted && (
                      <span className="inline-flex items-center rounded-full bg-stone-600 px-2 py-0.5 text-xs font-medium text-stone-200">
                        Auto
                      </span>
                    )}

                    {/* Modified badge */}
                    {risk.manuallyAdjusted && (
                      <span className="inline-flex items-center rounded-full bg-amber-600 px-2 py-0.5 text-xs font-medium text-white">
                        Modositott
                      </span>
                    )}
                  </div>

                  <p className="mt-1.5 text-xs text-stone-300">
                    {risk.reason}
                  </p>

                  {/* Controls */}
                  <div className="mt-2 flex items-center gap-3">
                    <select
                      value={risk.level}
                      onChange={(e) =>
                        handleLevelChange(index, e.target.value as RiskLevel)
                      }
                      className="min-h-[36px] rounded-lg border border-stone-600 bg-stone-800 px-2 py-1.5 text-xs text-stone-200 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600"
                    >
                      {LEVEL_OPTIONS.map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {LEVEL_CONFIG[lvl].label}
                        </option>
                      ))}
                    </select>

                    {risk.manuallyAdjusted && (
                      <button
                        type="button"
                        onClick={() => handleRestoreOriginal(index)}
                        className="text-xs text-amber-400 underline hover:text-amber-300"
                      >
                        Eredeti visszaallitasa
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
