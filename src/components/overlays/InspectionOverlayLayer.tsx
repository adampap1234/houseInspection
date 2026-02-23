import { AnimatePresence } from 'framer-motion'
import { useScrollStore } from '../../stores/useScrollStore'
import { OverlayPanel } from './OverlayPanel'

/**
 * Top-level DOM overlay that shows/hides the inspection overlay panel.
 *
 * Subscribes to activeStopIndex and isAtStop via React selectors (not getState)
 * — re-renders only when the stop changes, which is a few times during the
 * entire scroll. AnimatePresence handles mount/unmount transitions.
 *
 * The container is pointer-events-none so scroll events pass through.
 * Individual interactive elements inside OverlayPanel set pointer-events-auto.
 */
export function InspectionOverlayLayer() {
  const activeStopIndex = useScrollStore((s) => s.activeStopIndex)
  const isAtStop = useScrollStore((s) => s.isAtStop)

  return (
    <div className="fixed inset-0 z-20 pointer-events-none">
      <AnimatePresence mode="wait">
        {isAtStop && activeStopIndex >= 0 && (
          <OverlayPanel key={activeStopIndex} stopIndex={activeStopIndex} />
        )}
      </AnimatePresence>
    </div>
  )
}
