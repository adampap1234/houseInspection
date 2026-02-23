import { create } from 'zustand'

interface ScrollState {
  /** Normalized scroll progress: 0 at top, 1 at bottom */
  progress: number
  /** Current section index for inspection stops (used in Phase 3+) */
  sectionIndex: number
  /** Smoothed scroll progress for camera (dampened value) */
  dampedProgress: number
  /** Whether the camera is currently at an inspection stop */
  isAtStop: boolean
  /** Which inspection stop is active (-1 if none) */
  activeStopIndex: number
  /** Update scroll progress — call via getState(), not via hook selector */
  setProgress: (progress: number) => void
  /** Update section index — call via getState() */
  setSectionIndex: (index: number) => void
  /** Update damped progress — call via getState() in useFrame */
  setDampedProgress: (progress: number) => void
  /** Update stop state — call via getState() in useFrame */
  setIsAtStop: (isAtStop: boolean) => void
  /** Update active stop index — call via getState() in useFrame */
  setActiveStopIndex: (index: number) => void
}

export const useScrollStore = create<ScrollState>((set) => ({
  progress: 0,
  sectionIndex: 0,
  dampedProgress: 0,
  isAtStop: false,
  activeStopIndex: -1,
  setProgress: (progress) => set({ progress }),
  setSectionIndex: (index) => set({ sectionIndex: index }),
  setDampedProgress: (progress) => set({ dampedProgress: progress }),
  setIsAtStop: (isAtStop) => set({ isAtStop }),
  setActiveStopIndex: (index) => set({ activeStopIndex: index }),
}))
