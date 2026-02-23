import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  EffectComposer,
  DepthOfField,
  Vignette,
  HueSaturation,
  BrightnessContrast,
} from '@react-three/postprocessing'
import { MathUtils } from 'three'
import { useScrollStore } from '../stores/useScrollStore'

/**
 * Post-processing effects for the 3D scene.
 *
 * Always-on effects:
 * - Vignette: dark edges for cinematic framing
 * - HueSaturation: pulls back warm orange tones from the model's baked textures
 * - BrightnessContrast: deepens the mood to match the dark UI theme
 *
 * Stop-only effects:
 * - DepthOfField: bokeh blur activates at inspection stops
 */
export function PostProcessing() {
  const [bokeh, setBokeh] = useState(0)
  const dampedBokeh = useRef(0)
  const frameCount = useRef(0)

  useFrame((_, delta) => {
    const isAtStop = useScrollStore.getState().isAtStop

    // Target bokeh: strong blur at stops, zero during fly-through
    const target = isAtStop ? 5 : 0

    // Slower onset (lambda=2) for dramatic effect, faster release (lambda=4)
    const lambda = isAtStop ? 2 : 4
    dampedBokeh.current = MathUtils.damp(dampedBokeh.current, target, lambda, delta)

    // Update React state every 6 frames (~10Hz at 60fps) to avoid re-render spam
    frameCount.current++
    if (frameCount.current % 6 === 0) {
      setBokeh(dampedBokeh.current)
    }
  })

  return (
    <EffectComposer>
      {/* Cinematic vignette — darkens edges for focus and depth */}
      <Vignette offset={0.3} darkness={0.7} />
      {/* Pull saturation down to tame the model's warm baked textures */}
      <HueSaturation saturation={-0.2} hue={0} />
      {/* Slight contrast boost for a moodier feel matching the dark theme */}
      <BrightnessContrast brightness={-0.05} contrast={0.1} />
      {/* DoF bokeh only at inspection stops */}
      {bokeh > 0.01 && (
        <DepthOfField
          focusDistance={0.02}
          focalLength={0.025}
          bokehScale={bokeh}
          height={480}
        />
      )}
    </EffectComposer>
  )
}
