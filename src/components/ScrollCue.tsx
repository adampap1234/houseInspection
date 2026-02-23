import { AnimatePresence, motion } from 'framer-motion'
import { useScrollStore } from '../stores/useScrollStore'

/**
 * Bouncing scroll-down chevron shown at every inspection stop.
 * Tells users to keep scrolling to see the next section.
 *
 * Mobile: positioned just above the section panel (55vh from bottom).
 * Desktop: positioned at the bottom center of the viewport.
 *
 * Hidden during fly-through transitions (when no stop is active)
 * and at the very end of the scroll (last section).
 */
export function ScrollCue() {
  const isAtStop = useScrollStore((s) => s.isAtStop)
  const progress = useScrollStore((s) => s.progress)
  // Hide at the very end so there's no "scroll more" on the last section
  const visible = isAtStop && progress < 0.95

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="scroll-cue"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="
            fixed left-1/2 -translate-x-1/2 z-30
            pointer-events-none
            bottom-[56vh] sm:bottom-8
          "
        >
          <div className="animate-bounce">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-text-secondary/60"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
