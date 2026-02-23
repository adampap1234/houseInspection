import { useState, useEffect } from 'react'

interface ElectricalEffectProps {
  active: boolean
}

/**
 * Animated circuit/wiring diagram with pulsing energy flow.
 * Stylized wiring lines draw in around a central outlet box,
 * then pulse with amber energy color.
 *
 * Uses SVG stroke-dashoffset for draw-in animation and CSS
 * animation for the energy pulse effect.
 */
export function ElectricalEffect({ active }: ElectricalEffectProps) {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    if (active) {
      const timer = setTimeout(() => setAnimate(true), 100)
      return () => clearTimeout(timer)
    }
  }, [active])

  const wireColor = '#fbbf24' // amber/yellow — electrical energy
  const wireStyle = (delay: number) => ({
    strokeDasharray: 100,
    strokeDashoffset: animate ? 0 : 100,
    transition: `stroke-dashoffset 800ms ease-out ${delay}ms`,
  })

  return (
    <div className="w-full">
      <svg viewBox="0 0 200 150" className="w-full h-36">
        {/* Central outlet box */}
        <rect
          x="82"
          y="57"
          width="36"
          height="36"
          rx="4"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="2"
        />

        {/* Outlet holes */}
        <circle cx="93" cy="72" r="3" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
        <circle cx="107" cy="72" r="3" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
        {/* Ground slot */}
        <line x1="96" y1="82" x2="104" y2="82" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />

        {/* Wire 1 — top */}
        <path
          d="M 100 57 L 100 30 L 60 30 L 60 10"
          fill="none"
          stroke={wireColor}
          strokeWidth="2"
          strokeLinecap="round"
          style={wireStyle(0)}
          className={animate ? 'animate-pulse' : ''}
        />

        {/* Wire 2 — right */}
        <path
          d="M 118 75 L 150 75 L 150 45 L 180 45"
          fill="none"
          stroke={wireColor}
          strokeWidth="2"
          strokeLinecap="round"
          style={wireStyle(200)}
          className={animate ? 'animate-pulse' : ''}
        />

        {/* Wire 3 — bottom */}
        <path
          d="M 100 93 L 100 115 L 140 115 L 140 140"
          fill="none"
          stroke={wireColor}
          strokeWidth="2"
          strokeLinecap="round"
          style={wireStyle(400)}
          className={animate ? 'animate-pulse' : ''}
        />

        {/* Wire 4 — left */}
        <path
          d="M 82 75 L 50 75 L 50 110 L 20 110"
          fill="none"
          stroke={wireColor}
          strokeWidth="2"
          strokeLinecap="round"
          style={wireStyle(600)}
          className={animate ? 'animate-pulse' : ''}
        />

        {/* Junction dots at endpoints */}
        {animate && (
          <>
            <circle cx="60" cy="10" r="3" fill={wireColor} opacity="0.8" className="animate-pulse" />
            <circle cx="180" cy="45" r="3" fill={wireColor} opacity="0.8" className="animate-pulse" />
            <circle cx="140" cy="140" r="3" fill={wireColor} opacity="0.8" className="animate-pulse" />
            <circle cx="20" cy="110" r="3" fill={wireColor} opacity="0.8" className="animate-pulse" />
          </>
        )}
      </svg>
    </div>
  )
}
