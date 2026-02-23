import { useState, useEffect, type FC } from 'react'
import { motion, type Variants, type Easing } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { overlayConfigs } from '../../data/inspectionContent'
import { HumidityEffect } from './HumidityEffect'
import { ThermalEffect } from './ThermalEffect'
import { ElectricalEffect } from './ElectricalEffect'
import { LaserEffect } from './LaserEffect'

interface OverlayPanelProps {
  stopIndex: number
}

/**
 * Framer Motion slide variants with dynamic side support.
 * The `custom` prop passes the panel side ('left' | 'right')
 * so the slide direction adapts per stop.
 */
const easeOut: Easing = [0.25, 0.46, 0.45, 0.94]
const easeIn: Easing = [0.55, 0.06, 0.68, 0.19]

const slideVariants: Variants = {
  initial: (side: 'left' | 'right') => ({
    x: side === 'right' ? '100%' : '-100%',
    opacity: 0,
  }),
  animate: {
    x: 0,
    opacity: 1,
    transition: { type: 'tween', duration: 0.5, ease: easeOut },
  },
  exit: (side: 'left' | 'right') => ({
    x: side === 'right' ? '100%' : '-100%',
    opacity: 0,
    transition: { type: 'tween', duration: 0.4, ease: easeIn },
  }),
}

/** Map effect types to their React components */
const effectComponents: Record<string, FC<{ active: boolean }>> = {
  humidity: HumidityEffect,
  thermal: ThermalEffect,
  electrical: ElectricalEffect,
  laser: LaserEffect,
}

/** Small inline SVG service icons for each inspection type */
function ServiceIcon({ type }: { type: string }) {
  const className = "w-6 h-6 text-accent"
  const strokeProps = { stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" }

  switch (type) {
    case 'humidity':
      // Water droplet
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <path {...strokeProps} d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      )
    case 'thermal':
      // Thermometer / camera
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <path {...strokeProps} d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
        </svg>
      )
    case 'electrical':
      // Lightning bolt
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <polygon {...strokeProps} points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      )
    case 'laser':
      // Crosshair / target
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <circle {...strokeProps} cx="12" cy="12" r="10" />
          <line {...strokeProps} x1="22" y1="12" x2="18" y2="12" />
          <line {...strokeProps} x1="6" y1="12" x2="2" y2="12" />
          <line {...strokeProps} x1="12" y1="6" x2="12" y2="2" />
          <line {...strokeProps} x1="12" y1="22" x2="12" y2="18" />
        </svg>
      )
    default:
      return null
  }
}

/**
 * Glassmorphism overlay panel that slides in from the configured side.
 *
 * Renders at each inspection stop with a visual effect demonstration,
 * service name with icon, and bilingual description.
 *
 * Content is bilingual via react-i18next useTranslation hook.
 * Panel width is responsive: ~85vw on mobile, ~30vw on desktop.
 */
export function OverlayPanel({ stopIndex }: OverlayPanelProps) {
  const { t } = useTranslation()
  const config = overlayConfigs[stopIndex]
  const [effectActive, setEffectActive] = useState(false)

  // Stagger effect activation ~300ms after panel slide-in starts
  useEffect(() => {
    const timer = setTimeout(() => setEffectActive(true), 300)
    return () => clearTimeout(timer)
  }, [])

  if (!config) return null

  const isRight = config.side === 'right'
  const EffectComponent = effectComponents[config.effectType]

  return (
    <motion.div
      custom={config.side}
      variants={slideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`
        fixed top-0 h-full
        w-[85vw] sm:w-[50vw] md:w-[35vw] lg:w-[30vw] max-w-md
        bg-background/60 backdrop-blur-xl
        ${isRight ? 'right-0 border-l' : 'left-0 border-r'}
        border-white/10
        flex flex-col justify-center p-8 md:p-12
        pointer-events-auto overflow-y-auto
      `}
    >
      {/* Visual effect demonstration */}
      {EffectComponent && (
        <div className="mb-6">
          <EffectComponent active={effectActive} />
        </div>
      )}

      {/* Service title with icon */}
      <div className="flex items-center gap-3">
        <ServiceIcon type={config.effectType} />
        <h2 className="text-2xl md:text-3xl font-bold text-accent">
          {t(`${config.translationKey}.title`)}
        </h2>
      </div>

      {/* Service description */}
      <p className="text-text-secondary text-base md:text-lg mt-4 leading-relaxed">
        {t(`${config.translationKey}.description`)}
      </p>
    </motion.div>
  )
}
