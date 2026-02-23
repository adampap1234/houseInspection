import { useRef, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Vector3 } from 'three'
import { inspectionStops, cameraSpline } from '../data/cameraPath'

/**
 * Debug camera explorer — activated via ?debug=camera URL param.
 *
 * Provides OrbitControls for free exploration, and a HUD overlay
 * showing real-time camera position + lookAt direction.
 *
 * TEMPORARY: Remove before production.
 */

/** 3D part: OrbitControls + frame-by-frame position broadcast + teleport listener */
export function CameraDebugControls() {
  const { camera } = useThree()
  const controlsRef = useRef<any>(null)

  // Listen for teleport events from the HUD buttons
  useEffect(() => {
    const handler = (e: Event) => {
      const { x, y, z } = (e as CustomEvent).detail
      camera.position.set(x, y, z)
      if (controlsRef.current) {
        // Point OrbitControls target slightly ahead (+X direction)
        controlsRef.current.target.set(x + 2, y - 0.2, z)
        controlsRef.current.update()
      }
    }
    window.addEventListener('camera-teleport', handler)
    return () => window.removeEventListener('camera-teleport', handler)
  }, [camera])

  // Broadcast camera position to the HUD overlay via a custom event
  useFrame(() => {
    const dir = new Vector3()
    camera.getWorldDirection(dir)
    window.dispatchEvent(
      new CustomEvent('camera-debug', {
        detail: {
          px: camera.position.x.toFixed(2),
          py: camera.position.y.toFixed(2),
          pz: camera.position.z.toFixed(2),
          dx: dir.x.toFixed(2),
          dy: dir.y.toFixed(2),
          dz: dir.z.toFixed(2),
        },
      }),
    )
  })

  return <OrbitControls ref={controlsRef} makeDefault enableDamping dampingFactor={0.1} />
}

/** HTML overlay HUD showing camera info + teleport buttons */
export function CameraDebugHud() {
  const [pos, setPos] = useState({ px: '0', py: '0', pz: '0', dx: '0', dy: '0', dz: '0' })

  useEffect(() => {
    const handler = (e: Event) => {
      setPos((e as CustomEvent).detail)
    }
    window.addEventListener('camera-debug', handler)
    return () => window.removeEventListener('camera-debug', handler)
  }, [])

  // Teleport to a spline position
  const teleportToT = (t: number, label: string) => {
    const point = cameraSpline.getPointAt(Math.min(t, 0.9999))
    window.dispatchEvent(
      new CustomEvent('camera-teleport', {
        detail: { x: point.x, y: point.y, z: point.z, label },
      }),
    )
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 80,
        left: 12,
        zIndex: 9999,
        background: 'rgba(0,0,0,0.85)',
        color: '#0f0',
        fontFamily: 'monospace',
        fontSize: 13,
        padding: '10px 14px',
        borderRadius: 8,
        pointerEvents: 'auto',
        maxWidth: 320,
      }}
    >
      <div style={{ marginBottom: 6, color: '#ff0', fontWeight: 'bold' }}>Camera Debug</div>
      <div>
        pos: ({pos.px}, {pos.py}, {pos.pz})
      </div>
      <div style={{ marginBottom: 8 }}>
        dir: ({pos.dx}, {pos.dy}, {pos.dz})
      </div>

      <div style={{ color: '#ff0', marginBottom: 4, fontSize: 11 }}>TELEPORT TO STOP:</div>
      {inspectionStops.map((stop, i) => (
        <button
          key={stop.name}
          onClick={() => teleportToT(stop.splineT, stop.label)}
          style={{
            display: 'block',
            width: '100%',
            marginBottom: 3,
            padding: '4px 8px',
            background: '#333',
            color: '#fff',
            border: '1px solid #555',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 11,
            textAlign: 'left',
          }}
        >
          {i + 1}. {stop.label} (t={stop.splineT}) → target({stop.targetPosition.x.toFixed(1)},{' '}
          {stop.targetPosition.y.toFixed(1)}, {stop.targetPosition.z.toFixed(1)})
        </button>
      ))}

      <div style={{ color: '#ff0', marginTop: 8, marginBottom: 4, fontSize: 11 }}>SPLINE PATH:</div>
      {[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0].map((t) => {
        const p = cameraSpline.getPointAt(Math.min(t, 0.9999))
        return (
          <button
            key={t}
            onClick={() => teleportToT(t, `t=${t}`)}
            style={{
              display: 'inline-block',
              margin: '0 2px 3px 0',
              padding: '2px 6px',
              background: '#222',
              color: '#aaa',
              border: '1px solid #444',
              borderRadius: 3,
              cursor: 'pointer',
              fontSize: 10,
            }}
          >
            {t.toFixed(1)}
          </button>
        )
      })}

      <div style={{ color: '#888', marginTop: 8, fontSize: 10 }}>
        Use mouse to orbit/pan/zoom freely.
        <br />
        Copy coordinates from "pos" readout above.
      </div>
    </div>
  )
}
