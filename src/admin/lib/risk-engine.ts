import { v4 as uuidv4 } from 'uuid'
import type {
  Inspection,
  RiskScore,
  RiskLevel,
  MoistureData,
  ThermalData,
  ElectricalData,
  WallStructureData,
  ExteriorData,
  ChecklistItem,
} from '../types/inspection.ts'

// --- Helpers ---

function makeRisk(
  category: string,
  level: RiskLevel,
  reason: string
): RiskScore {
  return {
    id: uuidv4(),
    category,
    level,
    autoCalculated: true,
    manuallyAdjusted: false,
    reason,
  }
}

function checklistRisk(
  category: string,
  label: string,
  item: ChecklistItem
): RiskScore {
  return makeRisk(category, item.status, `${label}: ${item.status}`)
}

// --- Mold risk ---

export function calculateMoldRisk(moisture: MoistureData): RiskScore[] {
  if (moisture.rooms.length === 0) return []

  return moisture.rooms.map((room) => {
    const category = 'Peneszesedes kockazata'

    // Visible mold always kockazatos
    if (room.moldSigns === 'visible') {
      return makeRisk(
        category,
        'kockazatos',
        `${room.roomName}: Lathato penesz jelei`
      )
    }

    // Suspected mold signs
    if (room.moldSigns === 'suspected') {
      return makeRisk(
        category,
        'figyelendo',
        `${room.roomName}: Penesz gyanu`
      )
    }

    // High humidity + cold = critical mold risk
    if (room.relativeHumidity > 70 && room.temperature < 14) {
      return makeRisk(
        category,
        'kockazatos',
        `${room.roomName}: Magas paratartalom (${room.relativeHumidity}%) es alacsony homerseklet (${room.temperature}°C)`
      )
    }

    // High humidity but warm = warning
    if (room.relativeHumidity > 70) {
      return makeRisk(
        category,
        'figyelendo',
        `${room.roomName}: Magas paratartalom (${room.relativeHumidity}%)`
      )
    }

    // Musty smell bumps to at least figyelendo
    if (room.mustySmell) {
      return makeRisk(
        category,
        'figyelendo',
        `${room.roomName}: Dohos szag eszlelheto`
      )
    }

    // All normal
    return makeRisk(category, 'rendben', `${room.roomName}: Rendben`)
  })
}

// --- Thermal risk ---

export function calculateThermalRisk(thermal: ThermalData): RiskScore[] {
  const risks: RiskScore[] = []
  const category = 'Hoveszteseg'

  // Delta-T based risk
  if (thermal.deltaT > 5) {
    risks.push(
      makeRisk(
        category,
        'kockazatos',
        `Homerseklet kulonbseg: ${thermal.deltaT}°C (> 5°C)`
      )
    )
  } else if (thermal.deltaT >= 3) {
    risks.push(
      makeRisk(
        category,
        'figyelendo',
        `Homerseklet kulonbseg: ${thermal.deltaT}°C (3-5°C)`
      )
    )
  } else {
    risks.push(
      makeRisk(
        category,
        'rendben',
        `Homerseklet kulonbseg: ${thermal.deltaT}°C (< 3°C)`
      )
    )
  }

  // Checklist items
  const checklistItems: { key: keyof ThermalData; label: string }[] = [
    { key: 'thermalBridges', label: 'Hohid' },
    { key: 'insulation', label: 'Szigeteles' },
    { key: 'windowSeals', label: 'Ablak tomites' },
  ]

  for (const item of checklistItems) {
    const checklist = thermal[item.key] as ChecklistItem
    if (checklist.status !== 'rendben') {
      risks.push(checklistRisk(category, item.label, checklist))
    }
  }

  return risks
}

// --- Electrical risk ---

export function calculateElectricalRisk(
  electrical: ElectricalData
): RiskScore[] {
  const category = 'Elektromos rendszer'
  const items: { key: keyof ElectricalData; label: string }[] = [
    { key: 'panel', label: 'Eloszto tabla' },
    { key: 'wiring', label: 'Vezetekezese' },
    { key: 'outlets', label: 'Konnektor csatlakozok' },
    { key: 'grounding', label: 'Foldeles' },
    { key: 'gfci', label: 'FI-rele' },
  ]

  return items.map((item) =>
    checklistRisk(category, item.label, electrical[item.key])
  )
}

// --- Structural risk ---

export function calculateStructuralRisk(
  wallStructure: WallStructureData
): RiskScore[] {
  const category = 'Szerkezeti allapot'
  const items: { key: keyof WallStructureData; label: string }[] = [
    { key: 'loadBearing', label: 'Teherhordo szerkezet' },
    { key: 'cracks', label: 'Repedezetteseg' },
    { key: 'insulation', label: 'Szigeteles' },
    { key: 'dampProofing', label: 'Vizszigetelesek' },
  ]

  return items.map((item) =>
    checklistRisk(category, item.label, wallStructure[item.key])
  )
}

// --- Exterior risk ---

export function calculateExteriorRisk(exterior: ExteriorData): RiskScore[] {
  const category = 'Kulso allapot'
  const items: { key: keyof ExteriorData; label: string }[] = [
    { key: 'foundation', label: 'Alapozas' },
    { key: 'walls', label: 'Falazat' },
    { key: 'roof', label: 'Teto' },
    { key: 'gutters', label: 'Eresz / csatorna' },
    { key: 'grading', label: 'Tereprendezes' },
  ]

  return items.map((item) =>
    checklistRisk(category, item.label, exterior[item.key])
  )
}

// --- Aggregator ---

export function calculateRisks(inspection: Inspection): RiskScore[] {
  const risks: RiskScore[] = [
    ...calculateMoldRisk(inspection.moisture),
    ...calculateThermalRisk(inspection.thermal),
    ...calculateElectricalRisk(inspection.electrical),
    ...calculateStructuralRisk(inspection.wallStructure),
    ...calculateExteriorRisk(inspection.exterior),
  ]

  return risks
}
