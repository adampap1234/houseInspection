import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MathUtils, Vector3 } from 'three'
import { cameraSpline, inspectionStops, remapProgress } from '../data/cameraPath'
import { useScrollStore } from '../stores/useScrollStore'

// Reusable vectors to avoid per-frame allocations
const _lookTarget = new Vector3()

/**
 * Scroll-driven camera controller with sticky inspection stops.
 *
 * Reads scroll progress from the Zustand store every frame (via getState()
 * to avoid React re-renders) and positions the camera along a CatmullRom
 * spline path through the apartment.
 *
 * At inspection stops, the camera holds position and zooms in on the
 * inspection target. Extra scrolling is required to break free from
 * each sticky zone.
 *
 * MathUtils.damp provides frame-rate-independent exponential smoothing
 * for cinematic camera drift.
 */
export function CameraRig() {
  const dampedT = useRef(0)
  const dampedLookAt = useRef(new Vector3())
  const prevStopIndex = useRef(-1)

  useFrame((state, delta) => {
    const rawProgress = useScrollStore.getState().progress

    // Remap scroll progress through sticky zones
    const { effectiveT, activeStopIndex, isAtStop, fromStopIndex, toStopIndex, flyBlend } = remapProgress(rawProgress)

    // Determine damping speed based on state
    // At stop: slower (lambda=2) for dramatic deceleration
    // Leaving stop: faster (lambda=5) for responsive release
    // Flying: faster (lambda=5) for snappy transitions between stops
    const isLeaving = prevStopIndex.current >= 0 && !isAtStop
    const lambda = isAtStop ? 2 : isLeaving ? 5 : 5

    // Damp the effective spline position
    dampedT.current = MathUtils.damp(dampedT.current, effectiveT, lambda, delta)

    // Clamp to safe spline range
    const t = Math.max(0, Math.min(dampedT.current, 0.9999))

    // Camera position on spline
    const pos = cameraSpline.getPointAt(t)
    state.camera.position.copy(pos)

    // Determine lookAt target
    if (isAtStop && activeStopIndex >= 0 && activeStopIndex < inspectionStops.length) {
      // At a stop: look at the inspection target (close-up framing)
      const stop = inspectionStops[activeStopIndex]!
      _lookTarget.copy(stop.targetPosition)
    } else if (fromStopIndex >= 0 && toStopIndex >= 0 && fromStopIndex < inspectionStops.length && toStopIndex < inspectionStops.length) {
      // Flying between stops: interpolate lookAt between the two stop targets.
      // This prevents erratic left-right swinging from following the spline tangent.
      const fromTarget = inspectionStops[fromStopIndex]!.targetPosition
      const toTarget = inspectionStops[toStopIndex]!.targetPosition
      // Ease the blend for smoother rotation (ease-in-out)
      const easedBlend = flyBlend * flyBlend * (3 - 2 * flyBlend)
      _lookTarget.lerpVectors(fromTarget, toTarget, easedBlend)
    } else {
      // Fallback: look slightly ahead on spline
      _lookTarget.copy(cameraSpline.getPointAt(Math.min(t + 0.02, 1)))
    }

    // Damp the lookAt for smooth transitions
    const lookLambda = isAtStop ? 3 : 5
    dampedLookAt.current.x = MathUtils.damp(dampedLookAt.current.x, _lookTarget.x, lookLambda, delta)
    dampedLookAt.current.y = MathUtils.damp(dampedLookAt.current.y, _lookTarget.y, lookLambda, delta)
    dampedLookAt.current.z = MathUtils.damp(dampedLookAt.current.z, _lookTarget.z, lookLambda, delta)

    state.camera.lookAt(dampedLookAt.current)

    // Update store — only when values actually change to minimize writes
    const store = useScrollStore.getState()
    if (store.activeStopIndex !== activeStopIndex) {
      store.setActiveStopIndex(activeStopIndex)
    }
    if (store.isAtStop !== isAtStop) {
      store.setIsAtStop(isAtStop)
    }
    store.setDampedProgress(dampedT.current)

    // Track previous stop for leave detection
    prevStopIndex.current = activeStopIndex
  })

  // Pure side-effect controller — renders nothing
  return null
}
