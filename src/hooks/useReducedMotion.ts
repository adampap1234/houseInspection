import { useState, useEffect } from 'react'

/**
 * Detects the user's prefers-reduced-motion preference.
 *
 * Returns true when the user has enabled "Reduce motion" in their OS settings.
 * Responds to real-time changes (e.g., toggling the setting mid-session).
 *
 * Used by Scene to conditionally render the animated fly-through or
 * static room views fallback.
 */
export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  return prefersReduced
}
