/**
 * Section content configuration for the 6 scroll-driven content sections.
 *
 * Array indices align with `inspectionStops` from cameraPath.ts:
 *   0 = hero (Living Room start)
 *   1 = howItWorks (Living Room transition)
 *   2 = humidity (Living Room wall)
 *   3 = electrical (Kitchen)
 *   4 = laser/dimensions (Hallway)
 *   5 = thermal (Bedroom)
 */

export interface SectionConfig {
  /** Unique section identifier */
  id: string
  /** Translation key prefix under 'sections.*' */
  translationKey: string
  /** Which side the content panel appears on ('left' | 'right' | 'center') */
  side: 'left' | 'right' | 'center'
  /** Section layout type */
  type: 'hero' | 'howItWorks' | 'service'
  /** Visual effect component key (only for service sections) */
  effectType?: 'humidity' | 'thermal' | 'electrical' | 'laser'
}

export const sectionConfigs: SectionConfig[] = [
  {
    id: 'hero',
    translationKey: 'sections.hero',
    side: 'center',
    type: 'hero',
  },
  {
    id: 'howItWorks',
    translationKey: 'sections.howItWorks',
    side: 'right',
    type: 'howItWorks',
  },
  {
    id: 'humidity',
    translationKey: 'sections.humidity',
    side: 'left',
    type: 'service',
    effectType: 'humidity',
  },
  {
    id: 'electrical',
    translationKey: 'sections.electrical',
    side: 'right',
    type: 'service',
    effectType: 'electrical',
  },
  {
    id: 'laser',
    translationKey: 'sections.laser',
    side: 'right',
    type: 'service',
    effectType: 'laser',
  },
  {
    id: 'thermal',
    translationKey: 'sections.thermal',
    side: 'left',
    type: 'service',
    effectType: 'thermal',
  },
]
