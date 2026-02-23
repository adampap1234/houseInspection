import { type FC } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useScrollStore } from '../stores/useScrollStore'
import { HeroSection } from './sections/HeroSection'
import { HowItWorksSection } from './sections/HowItWorksSection'
import { ServiceSection } from './sections/ServiceSection'

/**
 * Maps each stop index to its section component.
 * Indices 0-1 use unique components; 2-5 all reuse ServiceSection
 * which reads the appropriate config per sectionIndex.
 */
const sectionComponents: Record<number, FC<{ sectionIndex: number }>> = {
  0: HeroSection,
  1: HowItWorksSection,
  2: ServiceSection,
  3: ServiceSection,
  4: ServiceSection,
  5: ServiceSection,
}

/**
 * Fixed-position DOM layer that orchestrates content section visibility.
 *
 * Subscribes to activeStopIndex and isAtStop from the Zustand scroll store
 * and renders the matching section component via AnimatePresence.
 *
 * - `mode="wait"` ensures the exiting section fully exits before the entering
 *   section starts, creating a cinematic 3D-only moment between stops.
 * - The container is pointer-events-none so scroll events pass through.
 * - `key={activeStopIndex}` forces mount/unmount cycles for transitions.
 */
export function ContentSectionLayer() {
  const activeStopIndex = useScrollStore((s) => s.activeStopIndex)
  const isAtStop = useScrollStore((s) => s.isAtStop)

  const SectionComponent =
    activeStopIndex >= 0 ? sectionComponents[activeStopIndex] : undefined

  return (
    <div className="fixed inset-0 z-20 pointer-events-none">
      <AnimatePresence mode="wait">
        {isAtStop && SectionComponent && (
          <SectionComponent
            key={activeStopIndex}
            sectionIndex={activeStopIndex}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
