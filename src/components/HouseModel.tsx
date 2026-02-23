import { useGLTF } from '@react-three/drei'
import { useEffect } from 'react'
import { Box3, Mesh, Vector3 } from 'three'

const MODEL_PATH = `${import.meta.env.BASE_URL}models/house-optimized.glb`
const DRACO_PATH = `${import.meta.env.BASE_URL}draco/`

export function HouseModel() {
  const { scene } = useGLTF(MODEL_PATH, DRACO_PATH)

  // Log bounding box for camera positioning (temporary debug)
  useEffect(() => {
    const box = new Box3().setFromObject(scene)
    const size = new Vector3()
    const center = new Vector3()
    box.getSize(size)
    box.getCenter(center)
    console.log('Model bounding box:', { min: box.min, max: box.max, size, center })
  }, [scene])

  // GPU memory cleanup on unmount — critical for HMR to avoid memory leaks
  useEffect(() => {
    return () => {
      scene.traverse((child) => {
        if (child instanceof Mesh) {
          child.geometry?.dispose()
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose())
          } else if (child.material) {
            child.material.dispose()
          }
        }
      })
    }
  }, [scene])

  return <primitive object={scene} />
}

// Preload at module level — starts loading immediately when imported,
// feeding progress to useProgress in LoadingScreen
useGLTF.preload(MODEL_PATH, DRACO_PATH)
