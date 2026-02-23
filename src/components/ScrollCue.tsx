import { useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useScrollStore } from '../stores/useScrollStore'
import { sectionScrollTargets, SECTION_COUNT } from '../data/cameraPath'

/**
 * Clickable scroll-down indicator shown at every inspection stop.
 * Clicking it smoothly scrolls to the next section.
 *
 * Mobile: positioned just above the section panel.
 * Desktop: positioned at the bottom center.
 * Hidden during fly-throughs and on the last section.
 */
export function ScrollCue() {
  const isAtStop = useScrollStore((s) => s.isAtStop)
  const activeStopIndex = useScrollStore((s) => s.activeStopIndex)
  const visible = isAtStop && activeStopIndex < SECTION_COUNT - 1

  const scrollToNext = useCallback(() => {
    const nextIndex = activeStopIndex + 1
    if (nextIndex >= SECTION_COUNT) return

    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    const targetY = sectionScrollTargets[nextIndex]! * maxScroll

    // Dispatch a synthetic wheel event so the snap-scroll listener handles it
    // OR just scroll directly — the scroll listener will pick it up
    window.scrollTo({ top: targetY, behavior: 'smooth' })
  }, [activeStopIndex])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="scroll-cue"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          onClick={scrollToNext}
          className="
            fixed left-1/2 -translate-x-1/2 z-30
            bottom-[56vh] sm:bottom-8
            pointer-events-auto cursor-pointer
            flex items-center justify-center
            w-12 h-12 rounded-full
            bg-accent/20 hover:bg-accent/30
            border border-accent/30
            backdrop-blur-sm
            transition-colors
          "
          aria-label="Scroll to next section"
        >
          <motion.svg
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-accent"
          >
            <polyline points="6 9 12 15 18 9" />
          </motion.svg>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
