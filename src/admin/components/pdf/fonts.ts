import { Font } from '@react-pdf/renderer'

/**
 * Register Inter font for @react-pdf/renderer.
 *
 * Uses Google Fonts CDN for TTF files since @fontsource only ships WOFF,
 * which react-pdf does not support. Inter latin-ext subset covers all
 * Hungarian diacritical characters (a, e, i, o, o, u, u, u).
 *
 * Must be called once before any PDF rendering.
 */
Font.register({
  family: 'Inter',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiA.woff2',
      fontWeight: 400,
      fontStyle: 'normal',
    },
    {
      src: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYAZ9hiA.woff2',
      fontWeight: 700,
      fontStyle: 'normal',
    },
  ],
})

// Disable word hyphenation for Hungarian (hyphenation patterns not available)
Font.registerHyphenationCallback((word) => [word])

export const FONT_FAMILY = 'Inter'
