import { Environment } from '@react-three/drei'

export function SceneLighting() {
  return (
    <>
      <Environment
        files={`${import.meta.env.BASE_URL}hdri/environment.hdr`}
        background={false}
        environmentIntensity={0.6}
      />
      {/* Key light — neutral white with slight warmth */}
      <directionalLight
        position={[10, 8, 5]}
        intensity={1.0}
        color="#f0e6d8"
        castShadow={false}
      />
      {/* Soft ambient fill — cool neutral */}
      <ambientLight intensity={0.3} color="#e8e8f0" />
      {/* Cool fill from opposite side for depth */}
      <directionalLight
        position={[-5, 4, -3]}
        intensity={0.4}
        color="#c8cce0"
      />
    </>
  )
}
