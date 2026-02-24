import Dexie, { type Table } from 'dexie'
import type { Inspection, InspectionPhoto } from '../types/inspection.ts'

export class InspectionDB extends Dexie {
  inspections!: Table<Inspection>
  photos!: Table<InspectionPhoto>

  constructor() {
    super('InspectionDB')
    this.version(1).stores({
      // Indexed fields only. Dexie stores all fields but only indexes these.
      // Note: photo blob is stored but NOT indexed (Dexie best practice for large binary data)
      inspections: 'id, createdAt, syncStatus',
      photos: 'id, inspectionId, stepKey, syncStatus',
    })
  }
}

export const db = new InspectionDB()
