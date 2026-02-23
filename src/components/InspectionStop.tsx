import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { DoubleSide, MathUtils, Mesh } from 'three'
import { useScrollStore } from '../stores/useScrollStore'

interface InspectionStopProps {
  /** Index into the inspectionStops array */
  stopIndex: number
  /** World position for the ring */
  position: [number, number, number]
  /** Euler rotation [x, y, z] */
  rotation: [number, number, number]
  /** Inner radius of the ring (default 0.3) */
  innerRadius?: number
  /** Outer radius of the ring (default 0.45) */
  outerRadius?: number
}

/**
 * Animated glow ring at an inspection stop.
 *
 * Renders two concentric rings:
 * - Inner sharp ring: the main highlight
 * - Outer halo ring: soft glow extending beyond the inner ring
 *
 * Uses MeshBasicMaterial (ignores scene lighting) for self-illuminated
 * glow effect. Opacity animates smoothly based on activeStopIndex from store.
 */
export function InspectionStop({
  stopIndex,
  position,
  rotation,
  innerRadius = 0.3,
  outerRadius = 0.45,
}: InspectionStopProps) {
  const innerRef = useRef<Mesh>(null)
  const haloRef = useRef<Mesh>(null)
  const currentOpacity = useRef(0)
  const currentHaloOpacity = useRef(0)
  const currentScale = useRef(1)

  useFrame((_, delta) => {
    const activeStopIndex = useScrollStore.getState().activeStopIndex
    const isActive = activeStopIndex === stopIndex

    // Target values
    const targetOpacity = isActive ? 0.8 : 0
    const targetHaloOpacity = isActive ? 0.3 : 0
    const targetScale = isActive ? 1.05 : 1.0

    // Smooth damping
    currentOpacity.current = MathUtils.damp(currentOpacity.current, targetOpacity, 4, delta)
    currentHaloOpacity.current = MathUtils.damp(currentHaloOpacity.current, targetHaloOpacity, 3, delta)
    currentScale.current = MathUtils.damp(currentScale.current, targetScale, 4, delta)

    // Update inner ring
    if (innerRef.current) {
      const mat = innerRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = currentOpacity.current
      innerRef.current.scale.setScalar(currentScale.current)
    }

    // Update halo ring
    if (haloRef.current) {
      const mat = haloRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = currentHaloOpacity.current
      haloRef.current.scale.setScalar(currentScale.current * 1.1)
    }
  })

  return (
    <group position={position} rotation={rotation}>
      {/* Outer halo ring — soft glow extending beyond */}
      <mesh ref={haloRef}>
        <ringGeometry args={[outerRadius, outerRadius + 0.15, 64]} />
        <meshBasicMaterial
          color="#d4a040"
          transparent
          opacity={0}
          depthWrite={false}
          side={DoubleSide}
        />
      </mesh>

      {/* Inner sharp ring — main highlight */}
      <mesh ref={innerRef}>
        <ringGeometry args={[innerRadius, outerRadius, 64]} />
        <meshBasicMaterial
          color="#d4a040"
          transparent
          opacity={0}
          depthWrite={false}
          side={DoubleSide}
        />
      </mesh>
    </group>
  )
}

// THREE namespace import for material type assertion
import type * as THREE from 'three'
