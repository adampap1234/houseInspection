import { Font } from '@react-pdf/renderer'

/**
 * Register Inter font for @react-pdf/renderer.
 *
 * Uses local TTF files (from Inter v4.1 release) because @react-pdf/renderer
 * cannot embed WOFF2 fonts — the glyph encoder throws a DataView RangeError.
 * Full (non-subset) TTF includes all Hungarian diacritical characters.
 *
 * Must be called once before any PDF rendering.
 */
const base = import.meta.env.BASE_URL ?? '/'

Font.register({
  family: 'Inter',
  fonts: [
    {
      src: `${base}fonts/Inter-Regular.ttf`,
      fontWeight: 400,
      fontStyle: 'normal',
    },
    {
      src: `${base}fonts/Inter-Bold.ttf`,
      fontWeight: 700,
      fontStyle: 'normal',
    },
  ],
})

// Disable word hyphenation for Hungarian (hyphenation patterns not available)
Font.registerHyphenationCallback((word) => [word])

export const FONT_FAMILY = 'Inter'
