import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import { cameraSpline, inspectionStops } from '../data/cameraPath'
import { useScrollStore } from '../stores/useScrollStore'

/**
 * Static camera positions for each section of the scroll.
 * Used as the reduced-motion fallback — camera snaps between these views
 * with NO animation or smooth transitions.
 *
 * Each view corresponds to a room or inspection stop area.
 */
const staticViews: Array<{ position: Vector3; lookAt: Vector3; stopIndex: number }> = [
  {
    // Section 0 (0-20%): Living room entry — wide shot
    position: cameraSpline.getPointAt(0.05),
    lookAt: cameraSpline.getPointAt(0.15),
    stopIndex: -1,
  },
  {
    // Section 1 (20-40%): Humidity stop — living room wall
    position: cameraSpline.getPointAt(inspectionStops[0]!.splineT),
    lookAt: inspectionStops[0]!.targetPosition,
    stopIndex: 0,
  },
  {
    // Section 2 (40-60%): Electrical stop — kitchen counter
    position: cameraSpline.getPointAt(inspectionStops[1]!.splineT),
    lookAt: inspectionStops[1]!.targetPosition,
    stopIndex: 1,
  },
  {
    // Section 3 (60-80%): Dimensions stop — hallway
    position: cameraSpline.getPointAt(inspectionStops[2]!.splineT),
    lookAt: inspectionStops[2]!.targetPosition,
    stopIndex: 2,
  },
  {
    // Section 4 (80-100%): Thermal stop — bedroom window
    position: cameraSpline.getPointAt(inspectionStops[3]!.splineT),
    lookAt: inspectionStops[3]!.targetPosition,
    stopIndex: 3,
  },
]

/**
 * Alternative camera controller for prefers-reduced-motion users.
 *
 * Instead of smooth spline animation, the camera snaps instantly to
 * predefined static positions based on scroll section. No damping,
 * no smooth transitions — deliberately NOT animated.
 *
 * The 3D scene (model + lighting) still renders, users just navigate
 * between discrete views by scrolling.
 */
export function StaticRoomView() {
  const prevSection = useRef(-1)

  useFrame((state) => {
    const progress = useScrollStore.getState().progress

    // Determine which section the user is in (0-4)
    const section = Math.min(Math.floor(progress * 5), 4)

    // Only update camera when section changes (avoids unnecessary writes)
    if (section !== prevSection.current) {
      const view = staticViews[section]!
      state.camera.position.copy(view.position)
      state.camera.lookAt(view.lookAt)

      // Update store so other components know which stop is active
      const store = useScrollStore.getState()
      store.setActiveStopIndex(view.stopIndex)
      store.setIsAtStop(view.stopIndex >= 0)

      prevSection.current = section
    }
  })

  // Pure side-effect controller — renders nothing
  return null
}
