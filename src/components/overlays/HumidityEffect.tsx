import { useState, useEffect } from 'react'

interface HumidityEffectProps {
  active: boolean
}

/**
 * Animated circular SVG gauge that fills up to a moisture percentage.
 * Looks like a real humidity meter display.
 *
 * Uses CSS transition on stroke-dashoffset for smooth, GPU-accelerated animation.
 * A short delay after mount ensures the CSS transition triggers on initial render.
 */
export function HumidityEffect({ active }: HumidityEffectProps) {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    if (active) {
      const timer = setTimeout(() => setAnimate(true), 100)
      return () => clearTimeout(timer)
    }
  }, [active])

  const radius = 45
  const circumference = 2 * Math.PI * radius
  const fillPercent = 0.78
  const offset = circumference * (1 - fillPercent)

  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox="0 0 120 120" className="w-32 h-32">
        {/* Background track */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="8"
        />
        {/* Animated fill arc */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#4ade80"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={animate ? offset : circumference}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
          style={{
            transition: 'stroke-dashoffset 1.5s ease-out',
          }}
        />
        {/* Center percentage text */}
        <text
          x="60"
          y="55"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize="22"
          fontWeight="bold"
          fontFamily="Inter, system-ui, sans-serif"
        >
          {animate ? '78%' : '0%'}
        </text>
        {/* Label */}
        <text
          x="60"
          y="73"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="rgba(255,255,255,0.5)"
          fontSize="10"
          fontFamily="Inter, system-ui, sans-serif"
        >
          MOISTURE
        </text>
      </svg>
    </div>
  )
}
