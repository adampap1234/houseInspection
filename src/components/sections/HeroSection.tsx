import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { SectionShell, childVariants } from './SectionShell'
import { ContactStrip } from '../ContactStrip'

interface HeroSectionProps {
  sectionIndex: number
}

/**
 * Hero section (stop index 0). Renders the H1 headline, subtitle,
 * three promise items, trust text, two CTAs, and a scroll prompt.
 *
 * All content is bilingual via useTranslation.
 */
export function HeroSection({ sectionIndex: _sectionIndex }: HeroSectionProps) {
  const { t } = useTranslation()
  const promises = t('sections.hero.promises', { returnObjects: true }) as string[]

  return (
    <SectionShell side="center">
      {/* H1 heading */}
      <motion.h1
        variants={childVariants}
        className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-accent leading-tight"
      >
        {t('sections.hero.h1')}
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        variants={childVariants}
        className="text-text-secondary text-xs sm:text-base md:text-lg mt-2 sm:mt-4 leading-relaxed"
      >
        {t('sections.hero.subtitle')}
      </motion.p>

      {/* Three promise items */}
      <motion.div variants={childVariants} className="flex flex-col gap-1.5 sm:gap-3 mt-3 sm:mt-6">
        {promises.map((promise, i) => (
          <div key={i} className="flex items-start gap-2 sm:gap-3">
            {/* Checkmark circle icon */}
            <svg
              viewBox="0 0 24 24"
              className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-accent flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="9 12 11.5 14.5 16 10" />
            </svg>
            <span className="text-text-secondary text-xs sm:text-base leading-relaxed">
              {promise}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Trust text — hidden on small mobile to save space */}
      <motion.p
        variants={childVariants}
        className="hidden sm:block text-text-secondary/80 text-sm mt-6 italic border-l-2 border-accent/30 pl-4"
      >
        {t('sections.hero.trustText')}
      </motion.p>

      {/* Contact info */}
      <motion.div variants={childVariants}>
        <ContactStrip />
      </motion.div>

      {/* Scroll prompt — hidden on mobile to save space */}
      <motion.p
        variants={childVariants}
        className="hidden sm:block text-text-secondary/60 text-sm mt-4"
      >
        {t('sections.hero.scrollPrompt')}
      </motion.p>
    </SectionShell>
  )
}
