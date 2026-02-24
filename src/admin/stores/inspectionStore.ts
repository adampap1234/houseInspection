import { create } from 'zustand'

interface InspectionStoreState {
  currentInspectionId: string | null
  currentStep: number
  setStep: (step: number) => void
  setInspectionId: (id: string | null) => void
}

/**
 * Lightweight navigation store for the inspection wizard.
 * Actual inspection data lives in Dexie (IndexedDB), not here.
 * This store only tracks which inspection is being edited and which step is active.
 */
export const useInspectionStore = create<InspectionStoreState>((set) => ({
  currentInspectionId: null,
  currentStep: 0,
  setStep: (step: number) => set({ currentStep: Math.max(0, Math.min(10, step)) }),
  setInspectionId: (id: string | null) => set({ currentInspectionId: id, currentStep: 0 }),
}))
