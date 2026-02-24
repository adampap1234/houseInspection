import { describe, it, expect } from 'vitest'
import {
  calculateMoldRisk,
  calculateThermalRisk,
  calculateElectricalRisk,
  calculateStructuralRisk,
  calculateExteriorRisk,
  calculateRisks,
} from './risk-engine.ts'
import { DEFAULT_INSPECTION } from '../types/inspection.ts'
import type {
  MoistureData,
  ThermalData,
  ElectricalData,
  WallStructureData,
  ExteriorData,
} from '../types/inspection.ts'

// --- Mold risk tests ---

describe('calculateMoldRisk', () => {
  it('returns kockazatos when high humidity AND cold temperature', () => {
    const moisture: MoistureData = {
      rooms: [
        {
          id: 'r1',
          roomName: 'Haloszoba',
          wallType: 'exterior',
          moisturePercent: 60,
          relativeHumidity: 75,
          temperature: 12,
          moldSigns: 'none',
          mustySmell: false,
        },
      ],
    }
    const risks = calculateMoldRisk(moisture)
    expect(risks.length).toBeGreaterThan(0)
    const risk = risks.find((r) => r.category === 'Peneszesedes kockazata')
    expect(risk).toBeDefined()
    expect(risk!.level).toBe('kockazatos')
    expect(risk!.autoCalculated).toBe(true)
  })

  it('returns rendben when humidity and temperature are normal', () => {
    const moisture: MoistureData = {
      rooms: [
        {
          id: 'r2',
          roomName: 'Nappali',
          wallType: 'interior',
          moisturePercent: 30,
          relativeHumidity: 55,
          temperature: 22,
          moldSigns: 'none',
          mustySmell: false,
        },
      ],
    }
    const risks = calculateMoldRisk(moisture)
    // Should have a risk entry for this room
    const risk = risks.find((r) => r.reason.includes('Nappali'))
    expect(risk).toBeDefined()
    expect(risk!.level).toBe('rendben')
  })

  it('returns figyelendo when high humidity but warm', () => {
    const moisture: MoistureData = {
      rooms: [
        {
          id: 'r3',
          roomName: 'Furdo',
          wallType: 'interior',
          moisturePercent: 50,
          relativeHumidity: 80,
          temperature: 20,
          moldSigns: 'none',
          mustySmell: false,
        },
      ],
    }
    const risks = calculateMoldRisk(moisture)
    const risk = risks.find((r) => r.reason.includes('Furdo'))
    expect(risk).toBeDefined()
    expect(risk!.level).toBe('figyelendo')
  })

  it('returns kockazatos when visible mold signs regardless of numbers', () => {
    const moisture: MoistureData = {
      rooms: [
        {
          id: 'r4',
          roomName: 'Pince',
          wallType: 'exterior',
          moisturePercent: 30,
          relativeHumidity: 40,
          temperature: 22,
          moldSigns: 'visible',
          mustySmell: false,
        },
      ],
    }
    const risks = calculateMoldRisk(moisture)
    const risk = risks.find((r) => r.reason.includes('Pince'))
    expect(risk).toBeDefined()
    expect(risk!.level).toBe('kockazatos')
  })

  it('bumps to at least figyelendo when musty smell detected', () => {
    const moisture: MoistureData = {
      rooms: [
        {
          id: 'r5',
          roomName: 'Kamra',
          wallType: 'interior',
          moisturePercent: 25,
          relativeHumidity: 50,
          temperature: 20,
          moldSigns: 'none',
          mustySmell: true,
        },
      ],
    }
    const risks = calculateMoldRisk(moisture)
    const risk = risks.find((r) => r.reason.includes('Kamra'))
    expect(risk).toBeDefined()
    expect(risk!.level).toBe('figyelendo')
  })

  it('returns empty array when no rooms', () => {
    const moisture: MoistureData = { rooms: [] }
    const risks = calculateMoldRisk(moisture)
    expect(risks).toEqual([])
  })
})

// --- Thermal risk tests ---

describe('calculateThermalRisk', () => {
  it('returns kockazatos when deltaT > 5', () => {
    const thermal: ThermalData = {
      exteriorTemp: 0,
      interiorTemp: 22,
      deltaT: 6,
      thermalBridges: { status: 'rendben', notes: '' },
      insulation: { status: 'rendben', notes: '' },
      windowSeals: { status: 'rendben', notes: '' },
    }
    const risks = calculateThermalRisk(thermal)
    const tempRisk = risks.find((r) => r.category === 'Hoveszteseg')
    expect(tempRisk).toBeDefined()
    expect(tempRisk!.level).toBe('kockazatos')
  })

  it('returns figyelendo when deltaT 3-5', () => {
    const thermal: ThermalData = {
      exteriorTemp: 5,
      interiorTemp: 22,
      deltaT: 4,
      thermalBridges: { status: 'rendben', notes: '' },
      insulation: { status: 'rendben', notes: '' },
      windowSeals: { status: 'rendben', notes: '' },
    }
    const risks = calculateThermalRisk(thermal)
    const tempRisk = risks.find((r) => r.category === 'Hoveszteseg')
    expect(tempRisk).toBeDefined()
    expect(tempRisk!.level).toBe('figyelendo')
  })

  it('returns rendben when deltaT < 3', () => {
    const thermal: ThermalData = {
      exteriorTemp: 10,
      interiorTemp: 22,
      deltaT: 2,
      thermalBridges: { status: 'rendben', notes: '' },
      insulation: { status: 'rendben', notes: '' },
      windowSeals: { status: 'rendben', notes: '' },
    }
    const risks = calculateThermalRisk(thermal)
    const tempRisk = risks.find((r) => r.category === 'Hoveszteseg')
    expect(tempRisk).toBeDefined()
    expect(tempRisk!.level).toBe('rendben')
  })

  it('includes checklist items as separate risks', () => {
    const thermal: ThermalData = {
      exteriorTemp: 10,
      interiorTemp: 22,
      deltaT: 2,
      thermalBridges: { status: 'kockazatos', notes: 'Sulyos hohid' },
      insulation: { status: 'rendben', notes: '' },
      windowSeals: { status: 'figyelendo', notes: '' },
    }
    const risks = calculateThermalRisk(thermal)
    expect(risks.length).toBeGreaterThanOrEqual(2)
    const bridgeRisk = risks.find((r) => r.reason.includes('Hohid'))
    expect(bridgeRisk).toBeDefined()
    expect(bridgeRisk!.level).toBe('kockazatos')
  })
})

// --- Electrical risk tests ---

describe('calculateElectricalRisk', () => {
  it('returns kockazatos when any item is kockazatos', () => {
    const electrical: ElectricalData = {
      panel: { status: 'rendben', notes: '' },
      wiring: { status: 'kockazatos', notes: 'Regi vedetek' },
      outlets: { status: 'rendben', notes: '' },
      grounding: { status: 'rendben', notes: '' },
      gfci: { status: 'rendben', notes: '' },
    }
    const risks = calculateElectricalRisk(electrical)
    const wiringRisk = risks.find((r) => r.reason.includes('Vezetekezese'))
    expect(wiringRisk).toBeDefined()
    expect(wiringRisk!.level).toBe('kockazatos')
  })

  it('returns all rendben when all items rendben', () => {
    const electrical: ElectricalData = {
      panel: { status: 'rendben', notes: '' },
      wiring: { status: 'rendben', notes: '' },
      outlets: { status: 'rendben', notes: '' },
      grounding: { status: 'rendben', notes: '' },
      gfci: { status: 'rendben', notes: '' },
    }
    const risks = calculateElectricalRisk(electrical)
    expect(risks.every((r) => r.level === 'rendben')).toBe(true)
  })
})

// --- Structural risk tests ---

describe('calculateStructuralRisk', () => {
  it('returns risks from checklist items', () => {
    const wall: WallStructureData = {
      loadBearing: { status: 'kockazatos', notes: 'Repedezett' },
      cracks: { status: 'figyelendo', notes: '' },
      insulation: { status: 'rendben', notes: '' },
      dampProofing: { status: 'rendben', notes: '' },
    }
    const risks = calculateStructuralRisk(wall)
    const loadRisk = risks.find((r) => r.reason.includes('Teherhordo'))
    expect(loadRisk).toBeDefined()
    expect(loadRisk!.level).toBe('kockazatos')
  })
})

// --- Exterior risk tests ---

describe('calculateExteriorRisk', () => {
  it('returns risks from checklist items', () => {
    const exterior: ExteriorData = {
      foundation: { status: 'kockazatos', notes: 'Sullyedes' },
      walls: { status: 'rendben', notes: '' },
      roof: { status: 'figyelendo', notes: '' },
      gutters: { status: 'rendben', notes: '' },
      grading: { status: 'rendben', notes: '' },
    }
    const risks = calculateExteriorRisk(exterior)
    const foundRisk = risks.find((r) => r.reason.includes('Alapozas'))
    expect(foundRisk).toBeDefined()
    expect(foundRisk!.level).toBe('kockazatos')
  })
})

// --- Aggregator tests ---

describe('calculateRisks', () => {
  it('includes mold risk when high humidity room + cold corner', () => {
    const inspection = DEFAULT_INSPECTION()
    inspection.moisture = {
      rooms: [
        {
          id: 'r1',
          roomName: 'Haloszoba',
          wallType: 'exterior',
          moisturePercent: 65,
          relativeHumidity: 78,
          temperature: 11,
          moldSigns: 'none',
          mustySmell: false,
        },
      ],
    }
    const risks = calculateRisks(inspection)
    const moldRisk = risks.find((r) => r.category === 'Peneszesedes kockazata')
    expect(moldRisk).toBeDefined()
    expect(moldRisk!.level).toBe('kockazatos')
  })

  it('returns all rendben when inspection is clean', () => {
    const inspection = DEFAULT_INSPECTION()
    const risks = calculateRisks(inspection)
    // All risks should be rendben (defaults)
    expect(risks.every((r) => r.level === 'rendben')).toBe(true)
  })

  it('returns RiskScore[] with required fields', () => {
    const inspection = DEFAULT_INSPECTION()
    const risks = calculateRisks(inspection)
    for (const risk of risks) {
      expect(risk).toHaveProperty('id')
      expect(risk).toHaveProperty('category')
      expect(risk).toHaveProperty('level')
      expect(risk).toHaveProperty('autoCalculated')
      expect(risk).toHaveProperty('reason')
      expect(risk.autoCalculated).toBe(true)
    }
  })

  it('aggregates all category risks together', () => {
    const inspection = DEFAULT_INSPECTION()
    inspection.thermal.deltaT = 7
    inspection.electrical.wiring = { status: 'kockazatos', notes: 'Regi' }
    const risks = calculateRisks(inspection)
    const categories = new Set(risks.map((r) => r.category))
    // Should have thermal and electrical risk categories at minimum
    expect(categories.size).toBeGreaterThanOrEqual(2)
  })
})
