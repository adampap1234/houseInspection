import { useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useScrollStore } from '../stores/useScrollStore'
import { sectionScrollTargets, SECTION_COUNT } from '../data/cameraPath'

/**
 * Classic mouse-scroll icon with animated wheel dot.
 * Universally recognized, clean, clickable.
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
    window.scrollTo({ top: targetY, behavior: 'smooth' })
  }, [activeStopIndex])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="scroll-cue"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.4 }}
          onClick={scrollToNext}
          className="
            fixed left-1/2 -translate-x-1/2 z-30
            bottom-[57vh] sm:bottom-8
            pointer-events-auto cursor-pointer
            flex flex-col items-center
            group
          "
          aria-label="Scroll to next section"
        >
          {/* Mouse outline */}
          <div className="relative w-6 h-10 rounded-full border-2 border-text-secondary/40 group-hover:border-accent/60 transition-colors">
            {/* Animated scroll wheel dot */}
            <motion.div
              animate={{ y: [0, 10, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-1/2 -translate-x-1/2 top-2 w-1 h-2.5 rounded-full bg-accent"
            />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
