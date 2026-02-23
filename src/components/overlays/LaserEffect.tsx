import { useState, useEffect, useRef, useCallback } from 'react'

interface LaserEffectProps {
  active: boolean
}

/**
 * Animated laser measurement dimension lines with counting numbers.
 * Red laser lines extend outward with end caps, while measurement
 * numbers count up to the final value.
 *
 * Uses SVG stroke-dashoffset for line extension and requestAnimationFrame
 * for smooth number counter animation.
 */
export function LaserEffect({ active }: LaserEffectProps) {
  const [animate, setAnimate] = useState(false)
  const [hValue, setHValue] = useState(0)
  const [vValue, setVValue] = useState(0)
  const rafRef = useRef<number>(0)

  const animateCounters = useCallback(() => {
    const hTarget = 4.82
    const vTarget = 2.65
    const duration = 1500
    const startTime = performance.now()

    const step = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out: 1 - (1 - t)^3
      const eased = 1 - Math.pow(1 - progress, 3)

      setHValue(hTarget * eased)
      setVValue(vTarget * eased)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step)
      }
    }

    rafRef.current = requestAnimationFrame(step)
  }, [])

  useEffect(() => {
    if (active) {
      const timer = setTimeout(() => {
        setAnimate(true)
        animateCounters()
      }, 100)
      return () => {
        clearTimeout(timer)
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [active, animateCounters])

  const laserColor = '#ef4444' // red — laser color

  return (
    <div className="w-full">
      <svg viewBox="0 0 240 120" className="w-full h-28">
        {/* === Horizontal measurement line === */}

        {/* Main horizontal line */}
        <line
          x1="20"
          y1="55"
          x2="175"
          y2="55"
          stroke={laserColor}
          strokeWidth="2"
          strokeDasharray="155"
          strokeDashoffset={animate ? 0 : 155}
          style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
        />

        {/* Left end cap */}
        <line
          x1="20"
          y1="45"
          x2="20"
          y2="65"
          stroke={laserColor}
          strokeWidth="2"
          style={{
            opacity: animate ? 1 : 0,
            transition: 'opacity 0.3s ease-out',
          }}
        />

        {/* Right end cap */}
        <line
          x1="175"
          y1="45"
          x2="175"
          y2="65"
          stroke={laserColor}
          strokeWidth="2"
          style={{
            opacity: animate ? 1 : 0,
            transition: 'opacity 0.3s ease-out 0.8s',
          }}
        />

        {/* Laser dot indicators */}
        <circle
          cx="20"
          cy="55"
          r="3"
          fill={laserColor}
          style={{
            opacity: animate ? 1 : 0,
            transition: 'opacity 0.3s ease-out',
            filter: 'drop-shadow(0 0 4px rgba(239, 68, 68, 0.8))',
          }}
        />
        <circle
          cx="175"
          cy="55"
          r="3"
          fill={laserColor}
          style={{
            opacity: animate ? 1 : 0,
            transition: 'opacity 0.3s ease-out 0.8s',
            filter: 'drop-shadow(0 0 4px rgba(239, 68, 68, 0.8))',
          }}
        />

        {/* Horizontal measurement value */}
        <text
          x="97"
          y="42"
          textAnchor="middle"
          fill="white"
          fontSize="14"
          fontWeight="bold"
          fontFamily="'Courier New', monospace"
          style={{
            opacity: animate ? 1 : 0,
            transition: 'opacity 0.5s ease-out 0.5s',
          }}
        >
          {hValue.toFixed(2)} m
        </text>

        {/* === Vertical measurement line === */}

        {/* Main vertical line */}
        <line
          x1="210"
          y1="15"
          x2="210"
          y2="105"
          stroke={laserColor}
          strokeWidth="2"
          strokeDasharray="90"
          strokeDashoffset={animate ? 0 : 90}
          style={{ transition: 'stroke-dashoffset 1s ease-out 0.6s' }}
        />

        {/* Top end cap */}
        <line
          x1="200"
          y1="15"
          x2="220"
          y2="15"
          stroke={laserColor}
          strokeWidth="2"
          style={{
            opacity: animate ? 1 : 0,
            transition: 'opacity 0.3s ease-out 0.6s',
          }}
        />

        {/* Bottom end cap */}
        <line
          x1="200"
          y1="105"
          x2="220"
          y2="105"
          stroke={laserColor}
          strokeWidth="2"
          style={{
            opacity: animate ? 1 : 0,
            transition: 'opacity 0.3s ease-out 1.2s',
          }}
        />

        {/* Vertical measurement value */}
        <text
          x="210"
          y="65"
          textAnchor="middle"
          fill="white"
          fontSize="11"
          fontWeight="bold"
          fontFamily="'Courier New', monospace"
          style={{
            opacity: animate ? 1 : 0,
            transition: 'opacity 0.5s ease-out 1s',
          }}
          transform="rotate(-90 210 65)"
        >
          {vValue.toFixed(2)} m
        </text>
      </svg>
    </div>
  )
}
