import { v4 as uuidv4 } from 'uuid'

// --- Risk levels ---
export type RiskLevel = 'rendben' | 'figyelendo' | 'kockazatos'

// --- Reusable field types ---
export interface ChecklistItem {
  status: RiskLevel
  notes: string
}

// --- Step 0: Project Data ---
export interface ProjectData {
  clientName: string
  address: string
  inspectorName: string
  date: string
  projectType: string
  notes: string
}

// --- Step 1: Exterior ---
export interface ExteriorData {
  foundation: ChecklistItem
  walls: ChecklistItem
  roof: ChecklistItem
  gutters: ChecklistItem
  grading: ChecklistItem
}

// --- Step 2: Wall / Structure ---
export interface WallStructureData {
  loadBearing: ChecklistItem
  cracks: ChecklistItem
  insulation: ChecklistItem
  dampProofing: ChecklistItem
}

// --- Step 3: Moisture / Mold ---
export interface RoomMoisture {
  id: string
  roomName: string
  wallType: 'exterior' | 'interior'
  moisturePercent: number
  relativeHumidity: number
  temperature: number
  moldSigns: 'none' | 'suspected' | 'visible'
  mustySmell: boolean
}

export interface MoistureData {
  rooms: RoomMoisture[]
}

// --- Step 4: Thermal Camera ---
export interface ThermalData {
  exteriorTemp: number
  interiorTemp: number
  deltaT: number
  thermalBridges: ChecklistItem
  insulation: ChecklistItem
  windowSeals: ChecklistItem
}

// --- Step 5: Windows / Doors ---
export interface WindowsDoorsData {
  condition: ChecklistItem
  seals: ChecklistItem
  glass: ChecklistItem
  hardware: ChecklistItem
  weatherStripping: ChecklistItem
}

// --- Step 6: Electrical ---
export interface ElectricalData {
  panel: ChecklistItem
  wiring: ChecklistItem
  outlets: ChecklistItem
  grounding: ChecklistItem
  gfci: ChecklistItem
}

// --- Step 7: HVAC ---
export interface HvacData {
  heating: ChecklistItem
  cooling: ChecklistItem
  ventilation: ChecklistItem
  ductwork: ChecklistItem
  thermostat: ChecklistItem
}

// --- Step 8: Laser Measurements ---
export interface LaserMeasurement {
  id: string
  location: string
  dimension: string
  value: number
  unit: 'mm' | 'cm' | 'm'
  notes: string
}

export interface LaserData {
  measurements: LaserMeasurement[]
}

// --- Step 9: Risk Assessment ---
export interface RiskScore {
  id: string
  category: string
  level: RiskLevel
  autoCalculated: boolean
  manuallyAdjusted: boolean
  reason: string
}

// --- Step 10: Cost Estimation ---
export interface CostItem {
  id: string
  category: string
  description: string
  selected: boolean
  minCostHuf: number
  maxCostHuf: number
}

// --- Photos ---
export interface InspectionPhoto {
  id: string
  inspectionId: string
  stepKey: string
  roomId?: string
  photoType: 'visible' | 'thermal' | 'other'
  blob: Blob
  annotationData?: string
  createdAt: Date
  syncStatus: 'pending' | 'synced' | 'error'
}

// --- Union type for step data ---
export type InspectionStepData =
  | ProjectData
  | ExteriorData
  | WallStructureData
  | MoistureData
  | ThermalData
  | WindowsDoorsData
  | ElectricalData
  | HvacData
  | LaserData
  | RiskScore[]
  | CostItem[]

// --- Main Inspection entity ---
export interface Inspection {
  id: string
  projectData: ProjectData
  exterior: ExteriorData
  wallStructure: WallStructureData
  moisture: MoistureData
  thermal: ThermalData
  windowsDoors: WindowsDoorsData
  electrical: ElectricalData
  hvac: HvacData
  laser: LaserData
  risks: RiskScore[]
  costItems: CostItem[]
  currentStep: number
  createdAt: Date
  updatedAt: Date
  syncStatus: 'pending' | 'synced' | 'error'
}

// --- Defaults ---

function defaultChecklist(): ChecklistItem {
  return { status: 'rendben', notes: '' }
}

export function DEFAULT_INSPECTION(): Inspection {
  const now = new Date()
  return {
    id: uuidv4(),
    projectData: {
      clientName: '',
      address: '',
      inspectorName: '',
      date: now.toISOString().slice(0, 10),
      projectType: '',
      notes: '',
    },
    exterior: {
      foundation: defaultChecklist(),
      walls: defaultChecklist(),
      roof: defaultChecklist(),
      gutters: defaultChecklist(),
      grading: defaultChecklist(),
    },
    wallStructure: {
      loadBearing: defaultChecklist(),
      cracks: defaultChecklist(),
      insulation: defaultChecklist(),
      dampProofing: defaultChecklist(),
    },
    moisture: {
      rooms: [],
    },
    thermal: {
      exteriorTemp: 0,
      interiorTemp: 0,
      deltaT: 0,
      thermalBridges: defaultChecklist(),
      insulation: defaultChecklist(),
      windowSeals: defaultChecklist(),
    },
    windowsDoors: {
      condition: defaultChecklist(),
      seals: defaultChecklist(),
      glass: defaultChecklist(),
      hardware: defaultChecklist(),
      weatherStripping: defaultChecklist(),
    },
    electrical: {
      panel: defaultChecklist(),
      wiring: defaultChecklist(),
      outlets: defaultChecklist(),
      grounding: defaultChecklist(),
      gfci: defaultChecklist(),
    },
    hvac: {
      heating: defaultChecklist(),
      cooling: defaultChecklist(),
      ventilation: defaultChecklist(),
      ductwork: defaultChecklist(),
      thermostat: defaultChecklist(),
    },
    laser: {
      measurements: [],
    },
    risks: [],
    costItems: [],
    currentStep: 0,
    createdAt: now,
    updatedAt: now,
    syncStatus: 'pending',
  }
}
