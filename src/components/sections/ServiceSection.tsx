import { type FC } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { sectionConfigs } from '../../data/sectionContent'
import { SectionShell, childVariants } from './SectionShell'
import { ContactStrip } from '../ContactStrip'
import { HumidityEffect } from '../overlays/HumidityEffect'
import { ThermalEffect } from '../overlays/ThermalEffect'
import { ElectricalEffect } from '../overlays/ElectricalEffect'
import { LaserEffect } from '../overlays/LaserEffect'

interface ServiceSectionProps {
  sectionIndex: number
}

/** Map effectType to the existing Phase 4 visual effect components */
const effects: Record<string, FC<{ active: boolean }>> = {
  humidity: HumidityEffect,
  thermal: ThermalEffect,
  electrical: ElectricalEffect,
  laser: LaserEffect,
}

/**
 * Determines which translation sub-key holds the primary list
 * for each service type. Each service section has a differently-named
 * list (useCases, checks, detects) reflecting the nature of that service.
 */
const primaryListKey: Record<string, string> = {
  humidity: 'useCases',
  electrical: 'checks',
  laser: 'useCases',
  thermal: 'detects',
}

/**
 * Data-driven service section component reused for all 4 service types
 * (humidity, electrical, laser, thermal). Receives a sectionIndex (2-5)
 * and reads config from sectionConfigs to determine content and layout.
 */
export function ServiceSection({ sectionIndex }: ServiceSectionProps) {
  const { t } = useTranslation()
  const config = sectionConfigs[sectionIndex]

  if (!config || config.type !== 'service') return null

  const Effect = config.effectType ? effects[config.effectType] : null
  const listKey = config.effectType ? primaryListKey[config.effectType] : null

  const primaryItems = listKey
    ? (t(`${config.translationKey}.${listKey}`, { returnObjects: true }) as string[])
    : []

  const reportItems = t(`${config.translationKey}.reportIncludes`, {
    returnObjects: true,
  }) as string[]

  const trustNote = t(`${config.translationKey}.trustNote`, { defaultValue: '' })

  return (
    <SectionShell side={config.side}>
      {/* Visual effect area — hidden on mobile to save space */}
      {Effect && (
        <motion.div variants={childVariants} className="hidden sm:block mb-6">
          <Effect active={true} />
        </motion.div>
      )}

      {/* Section title */}
      <motion.h2
        variants={childVariants}
        className="text-lg sm:text-2xl md:text-3xl font-bold text-accent"
      >
        {t(`${config.translationKey}.title`)}
      </motion.h2>

      {/* Primary list (useCases / checks / detects) */}
      {primaryItems.length > 0 && (
        <motion.ul variants={childVariants} className="flex flex-col gap-1 sm:gap-2 mt-2 sm:mt-5">
          {primaryItems.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-text-secondary text-xs sm:text-base leading-relaxed">
              <span className="text-accent mt-0.5 sm:mt-1.5 flex-shrink-0">&#8226;</span>
              <span>{item}</span>
            </li>
          ))}
        </motion.ul>
      )}

      {/* Report includes list — hidden on mobile to save space */}
      {reportItems.length > 0 && (
        <motion.div variants={childVariants} className="hidden sm:block mt-5">
          <h3 className="text-text-secondary/70 text-sm font-semibold uppercase tracking-wide mb-2">
            {t('sections.common.reportIncludesLabel')}
          </h3>
          <ul className="flex flex-col gap-1.5">
            {reportItems.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-text-secondary/80 text-sm leading-relaxed">
                <span className="text-accent/60 mt-1 flex-shrink-0">&#8226;</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Trust note (optional -- laser has none) — hidden on mobile */}
      {trustNote && (
        <motion.p
          variants={childVariants}
          className="hidden sm:block text-text-secondary/80 text-sm mt-5 italic border-l-2 border-accent/30 pl-4"
        >
          {trustNote}
        </motion.p>
      )}

      {/* Contact strip */}
      <motion.div variants={childVariants}>
        <ContactStrip />
      </motion.div>
    </SectionShell>
  )
}
