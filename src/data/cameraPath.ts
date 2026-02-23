/**
 * Camera path data for the scroll-driven apartment walkthrough.
 *
 * Tuned for the Sketchfab "Modern Apartment" model using extracted object positions:
 *   Scene bbox: X[-6.5, 14.3] Y[0, 3.2] Z[-1.5, 4.5]
 *
 * Actual room layout (based on model node analysis):
 *   Living Room:  X ≈ -6.5 to -2   Z ≈ 0.5–1.5  (couch, speaker, cables, windows)
 *   Kitchen:      X ≈ -1 to 2      Z ≈ -0.9      (hobs, hood, oven, fridge, dining table at Z:1.5)
 *   Office:       X ≈ 4 to 5.5     Z ≈ -0.3–-1   (desk, iMac, pen holder)
 *   Hallway:      X ≈ 7 to 10      Z ≈ 2–3       (plants, shoes, bookcase at 6.16)
 *   Bathroom:     X ≈ 8.5          Z ≈ 2          (washing, toilet, fixtures)
 *   Bedroom:      X ≈ 11 to 14     Z ≈ -1.3       (bed, curtains, wardrobe)
 *   Entrance:     X ≈ 13           Z ≈ 4.4        (entrance door, shoe rack)
 *
 * Key objects for inspection targets:
 *   ElectricPlugs: (-6.42, 0.36, -0.94)
 *   Hobs/Hood:     (-0.96, 0.83–1.69, -0.91)
 *   Windows:       (-6.49, 1.47, 1.60)
 *   Curtains:      (12.04, 2.72, -1.34)
 *   Paintings:     (2.58, 1.61, 2.74)
 *
 * Room visit order: Living → Kitchen → Office/Hallway → Bedroom
 * Camera at y=1.6 (eye level)
 */

import { CatmullRomCurve3, Vector3 } from 'three'

// ---------------------------------------------------------------------------
// Spline control points
// ---------------------------------------------------------------------------

const controlPoints = [
  // [0] Living room start — near the window/speaker wall, looking inward
  new Vector3(-5, 1.6, 1.5),
  // [1] Living room center — between couch and paintings
  new Vector3(-3, 1.6, 1.2),
  // [2] Living room — humidity inspection area, near inner wall
  new Vector3(-1.5, 1.6, 2.2),
  // [3] Transition — pass dining table toward kitchen appliance wall
  new Vector3(-0.5, 1.6, 0.8),
  // [4] Kitchen center — facing hobs/hood on back wall
  new Vector3(0.5, 1.6, 0.0),
  // [5] Past kitchen, toward office
  new Vector3(2.5, 1.6, 0.0),
  // [6] Office area — laser measurement stop, looking back at dining/living
  new Vector3(4.74, 1.35, 0.0),
  // [7] Transition to hallway — gentle Z rise
  new Vector3(6.5, 1.6, 0.8),
  // [8] Hallway — staying low to avoid wall overshoot
  new Vector3(8, 1.6, 1.5),
  // [9] Hallway center — near doorway area
  new Vector3(9.5, 1.6, 1.2),
  // [10] Hallway-to-bedroom doorway — gradual Z descent
  new Vector3(10.5, 1.6, 0.8),
  // [11] Bedroom entry — thermal stop position (one step back from window)
  new Vector3(11.5, 1.6, 0.2),
  // [12] Bedroom center — facing curtains/window
  new Vector3(12.5, 1.6, -0.5),
  // [13] Bedroom end
  new Vector3(13, 1.6, 0.5),
]

/**
 * Smooth CatmullRom spline through the apartment.
 * - Not a closed loop (false)
 * - catmullrom type with 0.5 tension (balanced between smooth and tight)
 */
export const cameraSpline = new CatmullRomCurve3(
  controlPoints,
  false,          // closed
  'catmullrom',   // curveType
  0.7,            // tension (higher = tighter to control points, less wall overshoot)
)

// ---------------------------------------------------------------------------
// Inspection stop definitions
// ---------------------------------------------------------------------------

export interface InspectionStop {
  /** Identifier: 'hero' | 'howItWorks' | 'humidity' | 'electrical' | 'dimensions' | 'thermal' */
  name: string
  /** Human-readable label */
  label: string
  /** Which room this stop is in */
  room: string
  /** Approximate normalized position on the spline (0-1) */
  splineT: number
  /** The 3D point the camera looks at when stopped (close-up target) */
  targetPosition: Vector3
  /** Where to place the glow ring mesh in world space */
  ringPosition: Vector3
  /** Euler rotation [x, y, z] for the ring mesh */
  ringRotation: [number, number, number]
}

/**
 * Six content stops in SPATIAL order along the spline path.
 *
 * Order: hero (living start) → howItWorks (living transition) → humidity (living wall)
 *        → electrical (kitchen) → dimensions (hallway) → thermal (bedroom)
 *
 * splineT values are approximate — with 14 control points, each point ≈ t = index/13:
 *   point[0] ≈ 0.00, point[1] ≈ 0.08, point[2] ≈ 0.15, point[4] ≈ 0.31,
 *   point[6] ≈ 0.46, point[11] ≈ 0.85, point[12] ≈ 0.92
 */
export const inspectionStops: InspectionStop[] = [
  {
    name: 'hero',
    label: 'Hero',
    room: 'Living Room',
    splineT: 0.00,
    // Camera at start position (-5, 1.6, 1.5) looking slightly ahead along spline
    targetPosition: new Vector3(-3, 1.6, 1.2),
    ringPosition: new Vector3(-3, 1.6, 1.2),
    ringRotation: [0, 0, 0], // no ring needed for hero
  },
  {
    name: 'howItWorks',
    label: 'How It Works',
    room: 'Living Room',
    splineT: 0.08,
    // Camera at early living room position, looking forward along spline
    targetPosition: new Vector3(-1.5, 1.6, 2.2),
    ringPosition: new Vector3(-1.5, 1.6, 2.2),
    ringRotation: [0, 0, 0], // no ring needed for howItWorks
  },
  {
    name: 'humidity',
    label: 'Wall Humidity',
    room: 'Living Room',
    splineT: 0.15,
    // Target: living room inner wall, near paintings area
    // Camera at (-1.5, 1.6, 2.2) looking at wall further behind couch
    targetPosition: new Vector3(-2, 1.2, 3.5),
    ringPosition: new Vector3(-2, 1.2, 3.5),
    ringRotation: [Math.PI / 2, 0, 0], // ring flat against Z-facing wall
  },
  {
    name: 'electrical',
    label: 'Electrical Outlets',
    room: 'Kitchen',
    splineT: 0.31,
    // Target: kitchen back wall with hobs/hood at (-0.96, 0.83-1.69, -0.91)
    // Camera at (0.5, 1.6, 0.0) looking at the appliance wall
    targetPosition: new Vector3(-0.5, 1.0, -1.0),
    ringPosition: new Vector3(-0.5, 1.0, -1.0),
    ringRotation: [Math.PI / 2, 0, 0], // ring flat against Z-facing wall
  },
  {
    name: 'dimensions',
    label: 'Laser Dimensions',
    room: 'Office',
    splineT: 0.46,
    // Camera at (4.74, 1.35, 0.0) looking back toward dining/kitchen area
    // dir (-0.96, -0.27, 0.00) → target ≈ (0, 0, 0)
    targetPosition: new Vector3(0.0, 0.0, 0.0),
    ringPosition: new Vector3(0.0, 0.0, 0.0),
    ringRotation: [0, 0, 0],
  },
  {
    name: 'thermal',
    label: 'Window Thermal',
    room: 'Bedroom',
    splineT: 0.85,
    // Camera at ~(11.5, 1.6, 0.2) — one step back, looking at the curtains/window
    targetPosition: new Vector3(12, 1.8, -1.3),
    ringPosition: new Vector3(12, 1.8, -1.3),
    ringRotation: [Math.PI / 2, 0, 0], // ring flat against Z-facing wall
  },
]

// ---------------------------------------------------------------------------
// Scroll zone remapping (sticky stops)
// ---------------------------------------------------------------------------

/**
 * A scroll zone is either a fly-through segment or a sticky stop.
 * Fly zones interpolate between spline positions.
 * Stop zones hold the camera at a fixed spline position.
 */
interface ScrollZone {
  scrollStart: number
  scrollEnd: number
  type: 'fly' | 'stop'
  /** Start spline T for fly zones */
  splineTStart: number
  /** End spline T for fly zones */
  splineTEnd: number
  /** Index into inspectionStops array (for stop zones) */
  stopIndex: number
  /** For fly zones: index of the stop we're leaving */
  fromStopIndex?: number
  /** For fly zones: index of the stop we're heading to */
  toStopIndex?: number
}

/**
 * Scroll zones divide the 0-1 scroll range into 11 segments: 6 stops + 5 fly-throughs.
 *
 * Section order follows the camera's spatial path through the apartment:
 *   Hero (living start) → How it works (living transition) → Humidity (living wall)
 *   → Electrical (kitchen) → Laser/dimensions (hallway) → Thermal (bedroom)
 */
const scrollZones: ScrollZone[] = [
  // Section 0: Hero — camera at starting position (living room)
  { scrollStart: 0.00, scrollEnd: 0.10, type: 'stop', splineTStart: 0.00, splineTEnd: 0.00, stopIndex: 0 },
  // Fly: Hero → How it works
  { scrollStart: 0.10, scrollEnd: 0.16, type: 'fly', splineTStart: 0.00, splineTEnd: 0.08, stopIndex: -1, fromStopIndex: 0, toStopIndex: 1 },
  // Section 1: How it works — camera paused in early living room
  { scrollStart: 0.16, scrollEnd: 0.24, type: 'stop', splineTStart: 0.08, splineTEnd: 0.08, stopIndex: 1 },
  // Fly: How it works → Humidity
  { scrollStart: 0.24, scrollEnd: 0.32, type: 'fly', splineTStart: 0.08, splineTEnd: 0.15, stopIndex: -1, fromStopIndex: 1, toStopIndex: 2 },
  // Section 2: Humidity — living room wall
  { scrollStart: 0.32, scrollEnd: 0.42, type: 'stop', splineTStart: 0.15, splineTEnd: 0.15, stopIndex: 2 },
  // Fly: Humidity → Electrical
  { scrollStart: 0.42, scrollEnd: 0.52, type: 'fly', splineTStart: 0.15, splineTEnd: 0.31, stopIndex: -1, fromStopIndex: 2, toStopIndex: 3 },
  // Section 3: Electrical — kitchen appliance wall
  { scrollStart: 0.52, scrollEnd: 0.62, type: 'stop', splineTStart: 0.31, splineTEnd: 0.31, stopIndex: 3 },
  // Fly: Electrical → Laser/dimensions
  { scrollStart: 0.62, scrollEnd: 0.72, type: 'fly', splineTStart: 0.31, splineTEnd: 0.46, stopIndex: -1, fromStopIndex: 3, toStopIndex: 4 },
  // Section 4: Laser/dimensions — office area
  { scrollStart: 0.72, scrollEnd: 0.82, type: 'stop', splineTStart: 0.46, splineTEnd: 0.46, stopIndex: 4 },
  // Fly: Laser/dimensions → Thermal
  { scrollStart: 0.82, scrollEnd: 0.90, type: 'fly', splineTStart: 0.46, splineTEnd: 0.85, stopIndex: -1, fromStopIndex: 4, toStopIndex: 5 },
  // Section 5: Thermal — bedroom window/curtains
  { scrollStart: 0.90, scrollEnd: 1.00, type: 'stop', splineTStart: 0.85, splineTEnd: 0.85, stopIndex: 5 },
]

export interface RemappedProgress {
  /** Position on the spline (0-1) */
  effectiveT: number
  /** Which stop is active (-1 if flying) */
  activeStopIndex: number
  /** Whether camera is held at a stop */
  isAtStop: boolean
  /** 0 = just arrived at stop, 1 = about to leave (for animation timing) */
  stopBlend: number
  /** During fly-throughs: index of the stop we're leaving (-1 if at stop) */
  fromStopIndex: number
  /** During fly-throughs: index of the stop we're heading to (-1 if at stop) */
  toStopIndex: number
  /** During fly-throughs: 0-1 progress within the fly zone (for lookAt interpolation) */
  flyBlend: number
}

/**
 * Remap raw scroll progress (0-1) to spline position, accounting for sticky zones.
 *
 * In fly zones: linearly interpolate between spline positions.
 * In stop zones: hold at fixed spline position, compute blend for animation timing.
 */
export function remapProgress(rawProgress: number): RemappedProgress {
  const clamped = Math.max(0, Math.min(rawProgress, 1))

  for (const zone of scrollZones) {
    if (clamped >= zone.scrollStart && clamped <= zone.scrollEnd) {
      const zoneProgress = (clamped - zone.scrollStart) / (zone.scrollEnd - zone.scrollStart)

      if (zone.type === 'stop') {
        return {
          effectiveT: zone.splineTStart,
          activeStopIndex: zone.stopIndex,
          isAtStop: true,
          stopBlend: zoneProgress,
          fromStopIndex: -1,
          toStopIndex: -1,
          flyBlend: 0,
        }
      } else {
        // Fly zone: interpolate between spline positions
        const effectiveT = zone.splineTStart + zoneProgress * (zone.splineTEnd - zone.splineTStart)
        return {
          effectiveT,
          activeStopIndex: -1,
          isAtStop: false,
          stopBlend: 0,
          fromStopIndex: zone.fromStopIndex ?? -1,
          toStopIndex: zone.toStopIndex ?? -1,
          flyBlend: zoneProgress,
        }
      }
    }
  }

  // Fallback (shouldn't reach here with valid scroll zones)
  return {
    effectiveT: clamped,
    activeStopIndex: -1,
    isAtStop: false,
    stopBlend: 0,
    fromStopIndex: -1,
    toStopIndex: -1,
    flyBlend: 0,
  }
}

// ---------------------------------------------------------------------------
// Scroll configuration
// ---------------------------------------------------------------------------

/** Total scroll pages — 7 pages for 6 content sections with sufficient dwell time */
export const SCROLL_PAGES = 7

/** Number of snap sections (0-based: 0..SECTION_COUNT-1) */
export const SECTION_COUNT = 6

/**
 * Scroll progress targets for each section (midpoint of each stop zone).
 * Used by the snap-scroll listener to know where to scroll for each section.
 */
export const sectionScrollTargets: number[] = scrollZones
  .filter((z) => z.type === 'stop')
  .map((z) => (z.scrollStart + z.scrollEnd) / 2)
