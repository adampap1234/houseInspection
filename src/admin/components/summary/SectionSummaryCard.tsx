import { useState } from 'react'
import type { ChecklistItem, RiskLevel } from '../../types/inspection.ts'

const LEVEL_CONFIG: Record<
  RiskLevel,
  { label: string; badge: string }
> = {
  rendben: { label: 'Rendben', badge: 'bg-green-600 text-white' },
  figyelendo: { label: 'Figyelendo', badge: 'bg-yellow-600 text-white' },
  kockazatos: { label: 'Kockazatos', badge: 'bg-red-600 text-white' },
}

interface SectionSummaryCardProps {
  title: string
  stepIndex: number
  data: Record<string, unknown>
  onEdit: (stepIndex: number) => void
}

/**
 * Determine the worst risk level in the data record.
 * Returns 'kockazatos' > 'figyelendo' > 'rendben'.
 */
function getWorstLevel(data: Record<string, unknown>): RiskLevel {
  let worst: RiskLevel = 'rendben'

  for (const value of Object.values(data)) {
    if (isChecklistItem(value)) {
      if (value.status === 'kockazatos') return 'kockazatos'
      if (value.status === 'figyelendo') worst = 'figyelendo'
    }
  }

  return worst
}

function isChecklistItem(value: unknown): value is ChecklistItem {
  if (!value || typeof value !== 'object') return false
  const obj = value as Record<string, unknown>
  return (
    typeof obj.status === 'string' &&
    typeof obj.notes === 'string' &&
    ['rendben', 'figyelendo', 'kockazatos'].includes(obj.status as string)
  )
}

const BORDER_COLORS: Record<RiskLevel, string> = {
  rendben: 'border-green-700/50',
  figyelendo: 'border-yellow-700/50',
  kockazatos: 'border-red-700/50',
}

/**
 * Renders a single data value: ChecklistItem as badge, arrays as count,
 * primitives as-is.
 */
function renderValue(_key: string, value: unknown): React.ReactNode {
  // ChecklistItem
  if (isChecklistItem(value)) {
    const config = LEVEL_CONFIG[value.status]
    return (
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${config.badge}`}
        >
          {config.label}
        </span>
        {value.notes && (
          <span className="text-xs text-stone-400">{value.notes}</span>
        )}
      </div>
    )
  }

  // Arrays (rooms, measurements, cost items)
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <span className="text-stone-500">-</span>
    }
    return (
      <span className="text-stone-300">{value.length} tetel</span>
    )
  }

  // Numbers
  if (typeof value === 'number') {
    return <span className="text-stone-300">{value}</span>
  }

  // Booleans
  if (typeof value === 'boolean') {
    return (
      <span className="text-stone-300">{value ? 'Igen' : 'Nem'}</span>
    )
  }

  // Strings
  if (typeof value === 'string') {
    if (value === '') {
      return <span className="text-stone-500">-</span>
    }
    return <span className="text-stone-300">{value}</span>
  }

  // Nested objects (skip rendering)
  if (value && typeof value === 'object') {
    return <span className="text-stone-500">[objektum]</span>
  }

  return <span className="text-stone-500">-</span>
}

/** Hungarian-friendly field name labels */
const FIELD_LABELS: Record<string, string> = {
  // ProjectData
  clientName: 'Megbizo neve',
  address: 'Cim',
  inspectorName: 'Vizsgalo neve',
  date: 'Datum',
  projectType: 'Projekt tipus',
  notes: 'Megjegyzes',
  // Exterior
  foundation: 'Alapozas',
  walls: 'Falazat',
  roof: 'Teto',
  gutters: 'Eresz / csatorna',
  grading: 'Tereprendezes',
  // WallStructure
  loadBearing: 'Teherhordo szerkezet',
  cracks: 'Repedezetteseg',
  insulation: 'Szigeteles',
  dampProofing: 'Vizszigetelesek',
  // Moisture
  rooms: 'Szobak',
  // Thermal
  exteriorTemp: 'Kulso homerseklet',
  interiorTemp: 'Belso homerseklet',
  deltaT: 'Homerseklet kulonbseg',
  thermalBridges: 'Hohid',
  windowSeals: 'Ablak tomites',
  // WindowsDoors
  condition: 'Allapot',
  seals: 'Tomitesek',
  glass: 'Uveg',
  hardware: 'Vasalat',
  weatherStripping: 'Idojaras vedelem',
  // Electrical
  panel: 'Eloszto tabla',
  wiring: 'Vezetekezese',
  outlets: 'Konnektor csatlakozok',
  grounding: 'Foldeles',
  gfci: 'FI-rele',
  // HVAC
  heating: 'Futes',
  cooling: 'Hutes',
  ventilation: 'Szellozes',
  ductwork: 'Legcsatorna',
  thermostat: 'Termosztat',
  // Laser
  measurements: 'Meresek',
}

export function SectionSummaryCard({
  title,
  stepIndex,
  data,
  onEdit,
}: SectionSummaryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const worstLevel = getWorstLevel(data)
  const borderColor = BORDER_COLORS[worstLevel]

  const entries = Object.entries(data)

  return (
    <div
      className={`rounded-xl border-2 ${borderColor} bg-stone-800/50 overflow-hidden transition-colors`}
    >
      {/* Header - always visible */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-stone-700/30"
      >
        <div className="flex items-center gap-3">
          <span
            className={`text-sm transition-transform ${
              isExpanded ? 'rotate-90' : ''
            }`}
          >
            &#9654;
          </span>
          <div>
            <span className="font-medium text-stone-100">{title}</span>
            <span className="ml-2 text-xs text-stone-500">
              {entries.length} mezo
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onEdit(stepIndex)
          }}
          className="min-h-[36px] rounded-lg border border-stone-600 px-3 py-1.5 text-xs font-medium text-stone-300 transition-colors hover:border-amber-600 hover:bg-amber-600/10 hover:text-amber-400"
        >
          Szerkesztes
        </button>
      </button>

      {/* Body - expandable */}
      {isExpanded && (
        <div className="border-t border-stone-700 divide-y divide-stone-700/50">
          {entries.map(([key, value]) => (
            <div
              key={key}
              className="flex items-start justify-between gap-4 px-4 py-2.5"
            >
              <span className="min-w-[120px] text-sm font-medium text-stone-400">
                {FIELD_LABELS[key] ?? key}
              </span>
              <div className="flex-1 text-right">
                {renderValue(key, value)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
