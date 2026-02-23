import { type ReactNode } from 'react'
import { motion, type Variants } from 'framer-motion'

interface SectionShellProps {
  children: ReactNode
  side?: 'left' | 'right' | 'center'
  className?: string
}

/**
 * Stagger variants for the container: children animate in sequence.
 */
const containerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3 },
  },
}

/**
 * Child animation variants: fade + slide up for each staggered child.
 * Export so section components can apply to their direct children.
 */
export const childVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

/**
 * Reusable glassmorphism panel wrapper with entry/exit animations
 * and staggered child reveals.
 *
 * Mobile: bottom sheet covering lower ~45% of screen, 3D scene visible above.
 * Desktop: full-height side panel (left, right, or center).
 */
export function SectionShell({ children, side = 'right', className = '' }: SectionShellProps) {
  // Desktop side positioning (sm+)
  const desktopSideClasses =
    side === 'right'
      ? 'sm:right-0 sm:left-auto sm:border-l sm:border-white/10'
      : side === 'left'
        ? 'sm:left-0 sm:right-auto sm:border-r sm:border-white/10'
        : 'sm:left-1/2 sm:-translate-x-1/2 sm:right-auto'

  const desktopWidthClasses =
    side === 'center'
      ? 'sm:w-[80vw] md:w-[60vw] lg:w-[50vw] sm:max-w-3xl'
      : 'sm:w-[60vw] md:w-[45vw] lg:w-[40vw] sm:max-w-2xl'

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`
        fixed pointer-events-auto overflow-y-auto
        bg-background/60 backdrop-blur-lg
        sm:bg-background/80 sm:backdrop-blur-xl

        /* Mobile: bottom sheet */
        bottom-0 left-0 right-0
        h-[45vh] rounded-t-2xl
        border-t border-white/10
        p-4 pb-6

        /* Desktop: full-height side panel */
        sm:top-0 sm:bottom-0 sm:h-full
        sm:rounded-none sm:border-t-0
        sm:p-8 md:p-12
        sm:w-auto
        ${desktopWidthClasses}
        ${desktopSideClasses}

        flex flex-col justify-start
        ${className}
      `}
    >
      {/* Mobile drag handle indicator */}
      <div className="sm:hidden w-10 h-1 rounded-full bg-white/20 self-center mb-3 flex-shrink-0" />
      {children}
    </motion.div>
  )
}
