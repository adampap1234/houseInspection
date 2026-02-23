import { useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useScrollStore } from '../stores/useScrollStore'
import { sectionScrollTargets, SECTION_COUNT } from '../data/cameraPath'

const chevron = (
  <svg width="24" height="12" viewBox="0 0 24 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 2 12 10 20 2" />
  </svg>
)

/**
 * Cascading triple-chevron scroll indicator.
 * Three arrows stagger-animate downward in a wave, clearly
 * communicating "scroll down". Clickable — advances to next section.
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={scrollToNext}
          className="
            fixed left-1/2 -translate-x-1/2 z-30
            bottom-[57vh] sm:bottom-8
            pointer-events-auto cursor-pointer
            flex flex-col items-center -space-y-1
            group
          "
          aria-label="Scroll to next section"
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ opacity: [0.15, 0.9, 0.15], y: [0, 3, 0] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                delay: i * 0.25,
                ease: 'easeInOut',
              }}
              className="text-accent group-hover:text-accent-hover transition-colors"
            >
              {chevron}
            </motion.span>
          ))}
        </motion.button>
      )}
    </AnimatePresence>
  )
}
