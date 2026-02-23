import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { SectionShell, childVariants } from './SectionShell'
import { ContactStrip } from '../ContactStrip'

interface HowItWorksSectionProps {
  sectionIndex: number
}

/**
 * How It Works section (stop index 1). Renders a title, 4 numbered
 * process steps, and a CTA button. All content is bilingual.
 */
export function HowItWorksSection({ sectionIndex: _sectionIndex }: HowItWorksSectionProps) {
  const { t } = useTranslation()
  const steps = t('sections.howItWorks.steps', { returnObjects: true }) as string[]

  return (
    <SectionShell side="right">
      {/* Title */}
      <motion.h2
        variants={childVariants}
        className="text-lg sm:text-2xl md:text-3xl font-bold text-accent"
      >
        {t('sections.howItWorks.title')}
      </motion.h2>

      {/* Four numbered steps */}
      <motion.div variants={childVariants} className="flex flex-col gap-2 sm:gap-4 mt-3 sm:mt-6">
        {steps.map((step, i) => (
          <div key={i} className="flex items-start gap-2 sm:gap-3">
            {/* Number circle */}
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-[10px] sm:text-sm font-bold flex-shrink-0">
              {i + 1}
            </div>
            <span className="text-text-secondary text-xs sm:text-base leading-relaxed pt-0.5 sm:pt-1">
              {step}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Contact strip */}
      <motion.div variants={childVariants}>
        <ContactStrip />
      </motion.div>
    </SectionShell>
  )
}
