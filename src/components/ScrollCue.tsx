import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useScrollStore } from '../stores/useScrollStore'

/**
 * Bouncing scroll indicator at the hero position.
 *
 * Prompts users to start scrolling to explore the 3D walkthrough.
 * Uses the Hero section's scroll prompt text from translation files.
 * Disappears with a fade animation once the user starts scrolling
 * (progress > 0.02). Uses React selector from Zustand — only
 * re-renders when visibility threshold is crossed.
 */
export function ScrollCue() {
  const { t } = useTranslation()
  const progress = useScrollStore((s) => s.progress)
  const visible = progress < 0.02

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none"
        >
          {/* Bouncing chevron */}
          <div className="animate-bounce">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-text-secondary"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          {/* Hint text — uses Hero section's scroll prompt for richer copy */}
          <p className="text-text-secondary/70 text-sm font-medium tracking-wide max-w-xs text-center">
            {t('sections.hero.scrollPrompt')}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
