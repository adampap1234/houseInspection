import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { HouseModel } from './HouseModel'
import { SceneLighting } from './SceneLighting'
import { CameraRig } from './CameraRig'
import { InspectionStop } from './InspectionStop'
import { PostProcessing } from './PostProcessing'
import { StaticRoomView } from './StaticRoomView'
import { CameraDebugControls } from './CameraDebug'
import { inspectionStops } from '../data/cameraPath'
import { useReducedMotion } from '../hooks/useReducedMotion'

/** Check URL for ?debug=camera to enable exploration mode */
const isDebugCamera = new URLSearchParams(window.location.search).get('debug') === 'camera'

export function Scene() {
  const reducedMotion = useReducedMotion()

  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, toneMapping: 4 }}
        camera={{
          fov: 60,
          near: 0.1,
          far: 100,
          position: [-5, 1.6, 1.5],
        }}
      >
        {/* Dark background matching CSS --color-background */}
        <color attach="background" args={['#1a1614']} />
        {/* Exponential fog fades distant model edges into the dark background */}
        <fogExp2 attach="fog" args={['#1a1614', 0.06]} />

        {isDebugCamera ? (
          /* Debug mode: free orbit camera for finding good stop positions */
          <CameraDebugControls />
        ) : reducedMotion ? (
          /* Reduced motion: static room views, no animations or effects */
          <StaticRoomView />
        ) : (
          /* Full experience: animated fly-through with glow rings and DoF */
          <>
            <CameraRig />
            <PostProcessing />
          </>
        )}
        <Suspense fallback={null}>
          <SceneLighting />
          <HouseModel />
          {!reducedMotion &&
            !isDebugCamera &&
            inspectionStops.map((stop, i) => (
              <InspectionStop
                key={stop.name}
                stopIndex={i}
                position={[stop.ringPosition.x, stop.ringPosition.y, stop.ringPosition.z]}
                rotation={stop.ringRotation}
              />
            ))}
        </Suspense>
      </Canvas>
    </div>
  )
}
