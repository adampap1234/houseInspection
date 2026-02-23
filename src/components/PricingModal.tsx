import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { useTranslation } from 'react-i18next'

interface PricingModalProps {
  open: boolean
  onClose: () => void
}

const backdrop: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

const panel: Variants = {
  initial: { opacity: 0, scale: 0.92, y: 30 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 350, damping: 30 },
  },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } },
}

export function PricingModal({ open, onClose }: PricingModalProps) {
  const { t } = useTranslation()
  const items = t('pricing.includes', { returnObjects: true }) as string[]
  const phone = t('contact.phone')
  const email = t('contact.emailAddress')

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="pricing-backdrop"
          variants={backdrop}
          initial="initial"
          animate="animate"
          exit="exit"
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <motion.div
            variants={panel}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-surface rounded-2xl border border-white/10 overflow-hidden"
          >
            {/* Accent top bar */}
            <div className="h-1 bg-gradient-to-r from-accent via-accent-hover to-accent-muted" />

            <div className="p-6 sm:p-8">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors text-text-secondary hover:text-text-primary cursor-pointer"
                aria-label={t('pricing.close')}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Price badge */}
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/15">
                  <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <div>
                  <p className="text-accent text-2xl sm:text-3xl font-bold leading-none">
                    {t('pricing.price')}
                  </p>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-text-primary text-lg sm:text-xl font-semibold mb-1">
                {t('pricing.title')}
              </h3>

              {/* Tagline */}
              <p className="text-text-secondary text-sm mb-5">
                {t('pricing.tagline')}
              </p>

              {/* Includes list */}
              <p className="text-text-secondary/60 text-xs uppercase tracking-widest mb-3">
                {t('pricing.includesLabel')}
              </p>
              <ul className="flex flex-col gap-2.5 mb-6">
                {items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <svg className="w-4 h-4 text-success flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-text-secondary text-sm leading-snug">{item}</span>
                  </li>
                ))}
              </ul>

              {/* Contact row */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
                <a
                  href={`tel:${phone.replace(/\s/g, '')}`}
                  className="flex-1 min-w-[140px] flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-background font-semibold py-2.5 rounded-full transition-colors text-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {phone}
                </a>
                <a
                  href={`mailto:${email}`}
                  className="flex-1 min-w-[140px] flex items-center justify-center gap-2 border border-accent text-accent hover:bg-accent/10 font-semibold py-2.5 rounded-full transition-colors text-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {email}
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
