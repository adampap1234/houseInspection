/**
 * Per-stop overlay configuration for the inspection overlays.
 *
 * Array index aligns with `inspectionStops` from cameraPath.ts:
 *   0 = humidity (Living Room)
 *   1 = electrical (Kitchen)
 *   2 = laser/dimensions (Hallway)
 *   3 = thermal (Bedroom)
 */

export interface OverlayConfig {
  /** Translation key prefix for this service (e.g., 'services.humidity') */
  translationKey: string
  /** Which side the panel slides in from */
  side: 'left' | 'right'
  /** Visual effect type — determines which effect component renders */
  effectType: 'humidity' | 'thermal' | 'electrical' | 'laser'
}

export const overlayConfigs: OverlayConfig[] = [
  {
    translationKey: 'services.humidity',
    side: 'left',        // Living room — camera looks at far wall, panel on left keeps target visible
    effectType: 'humidity',
  },
  {
    translationKey: 'services.electrical',
    side: 'right',       // Kitchen — panel on right, counter area visible on left
    effectType: 'electrical',
  },
  {
    translationKey: 'services.laser',
    side: 'right',       // Hallway — panel on right side
    effectType: 'laser',
  },
  {
    translationKey: 'services.thermal',
    side: 'left',        // Bedroom — camera faces window, panel on left
    effectType: 'thermal',
  },
]
