import { useEffect, useRef } from 'react'
import { useScrollStore } from '../stores/useScrollStore'
import { SECTION_COUNT, sectionScrollTargets } from '../data/cameraPath'

/**
 * Snap-to-section scroll listener.
 *
 * Instead of free-scrolling through 700vh, each wheel gesture (or touch swipe)
 * smoothly animates the scroll position to the next/previous section.
 * The camera transitions through the fly zones between stops, creating a
 * cinematic one-gesture-per-section experience.
 *
 * Architecture:
 * - Wheel/touch events are intercepted and prevented from default scrolling
 * - A debounce window prevents rapid section-skipping
 * - requestAnimationFrame drives smooth scroll animation with easeInOutCubic
 * - The existing scroll event listener picks up the animated scrollY and
 *   updates the Zustand store, so CameraRig and ContentSectionLayer work unchanged
 */
export function useScrollListener() {
  const currentSection = useRef(0)
  const isAnimating = useRef(false)
  const animationId = useRef(0)
  const cooldownTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchStartY = useRef(0)

  useEffect(() => {
    // --- Scroll → progress updater (unchanged) ---
    const handleScroll = () => {
      const scrollY = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress = maxScroll > 0 ? Math.min(Math.max(scrollY / maxScroll, 0), 1) : 0
      useScrollStore.getState().setProgress(progress)
    }

    // --- Smooth scroll animation ---
    function animateScrollTo(targetY: number, duration: number, onDone: () => void) {
      const startY = window.scrollY
      const distance = targetY - startY
      const startTime = performance.now()

      // easeInOutCubic for cinematic feel
      function ease(t: number): number {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
      }

      function step(now: number) {
        const elapsed = now - startTime
        const t = Math.min(elapsed / duration, 1)
        window.scrollTo(0, startY + distance * ease(t))

        if (t < 1) {
          animationId.current = requestAnimationFrame(step)
        } else {
          onDone()
        }
      }

      cancelAnimationFrame(animationId.current)
      animationId.current = requestAnimationFrame(step)
    }

    // --- Navigate to section ---
    function goToSection(sectionIndex: number) {
      const clamped = Math.max(0, Math.min(sectionIndex, SECTION_COUNT - 1))
      if (clamped === currentSection.current && isAnimating.current) return

      currentSection.current = clamped
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const targetY = sectionScrollTargets[clamped]! * maxScroll

      isAnimating.current = true
      animateScrollTo(targetY, 900, () => {
        isAnimating.current = false
      })
    }

    // --- Wheel handler ---
    function handleWheel(e: WheelEvent) {
      e.preventDefault()

      // Ignore during cooldown to prevent section-skipping
      if (cooldownTimer.current) return

      const direction = e.deltaY > 0 ? 1 : -1
      const nextSection = currentSection.current + direction

      if (nextSection < 0 || nextSection >= SECTION_COUNT) return

      goToSection(nextSection)

      // Cooldown: ignore wheel events for 700ms after triggering a transition
      cooldownTimer.current = setTimeout(() => {
        cooldownTimer.current = null
      }, 700)
    }

    // --- Touch handlers for mobile ---
    function handleTouchStart(e: TouchEvent) {
      touchStartY.current = e.touches[0]!.clientY
    }

    function handleTouchEnd(e: TouchEvent) {
      if (cooldownTimer.current) return

      const deltaY = touchStartY.current - e.changedTouches[0]!.clientY
      const threshold = 50 // minimum swipe distance in px

      if (Math.abs(deltaY) < threshold) return

      const direction = deltaY > 0 ? 1 : -1
      const nextSection = currentSection.current + direction

      if (nextSection < 0 || nextSection >= SECTION_COUNT) return

      goToSection(nextSection)

      cooldownTimer.current = setTimeout(() => {
        cooldownTimer.current = null
      }, 700)
    }

    // Prevent default touch scrolling so we control it
    function handleTouchMove(e: TouchEvent) {
      e.preventDefault()
    }

    // --- Sync current section from initial scroll position ---
    handleScroll()
    const initialProgress = useScrollStore.getState().progress
    // Find which section we're closest to
    let closest = 0
    let closestDist = Infinity
    for (let i = 0; i < sectionScrollTargets.length; i++) {
      const dist = Math.abs(sectionScrollTargets[i]! - initialProgress)
      if (dist < closestDist) {
        closestDist = dist
        closest = i
      }
    }
    currentSection.current = closest

    // --- Attach listeners ---
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      cancelAnimationFrame(animationId.current)
      if (cooldownTimer.current) clearTimeout(cooldownTimer.current)
    }
  }, [])
}
