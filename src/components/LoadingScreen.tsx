import { useProgress } from '@react-three/drei'
import { useState, useEffect, useCallback } from 'react'

export function LoadingScreen() {
  const { progress, active } = useProgress()
  const [visible, setVisible] = useState(true)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    if (!active && progress >= 100) {
      const timer = setTimeout(() => setFading(true), 300)
      return () => clearTimeout(timer)
    }
  }, [active, progress])

  const handleTransitionEnd = useCallback(() => {
    if (fading) {
      setVisible(false)
    }
  }, [fading])

  if (!visible) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-700 ease-out ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      onTransitionEnd={handleTransitionEnd}
    >
      <span className="text-7xl md:text-8xl font-bold text-text-primary font-sans tabular-nums">
        {Math.round(progress)}%
      </span>
    </div>
  )
}
