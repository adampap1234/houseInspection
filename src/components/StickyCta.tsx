import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useScrollStore } from '../stores/useScrollStore'

/**
 * Floating CTA button that appears after the user scrolls past
 * the Hero section.
 *
 * Threshold: progress > 0.15 (after the Hero stop ends at scrollEnd 0.12
 * and the fly-through to HowItWorks is underway at 0.12-0.16).
 *
 * Clicking scrolls to the #contact section. The contact section
 * doesn't exist yet — the button is present but scrollIntoView
 * is a no-op. Phase 5 adds the target element.
 */
export function StickyCta() {
  const { t } = useTranslation()
  const progress = useScrollStore((s) => s.progress)
  const isAtStop = useScrollStore((s) => s.isAtStop)
  // Show only between sections — hide when a panel is open (panels have their own CTA)
  const visible = progress > 0.15 && !isAtStop

  const handleClick = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ y: 20, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          onClick={handleClick}
          className="
            fixed bottom-6 right-6 z-50
            bg-accent hover:bg-accent-hover
            text-background font-semibold
            px-6 py-3 rounded-full
            shadow-lg shadow-accent/20
            transition-colors cursor-pointer
            pointer-events-auto
          "
        >
          {t('cta.callback')}
        </motion.button>
      )}
    </AnimatePresence>
  )
}
