import { StyleSheet } from '@react-pdf/renderer'
import { FONT_FAMILY } from './fonts.ts'

/**
 * Professional brand colors — navy blue primary with amber accent.
 */
export const COLORS = {
  primary: '#1C3D5A',
  primaryLight: '#2A5478',
  accent: '#D97706',
  accentLight: '#F59E0B',
  text: '#1E293B',
  textLight: '#475569',
  textMuted: '#94A3B8',
  background: '#FFFFFF',
  backgroundAlt: '#F8FAFC',
  backgroundAccent: '#F1F5F9',
  border: '#CBD5E1',
  borderLight: '#E2E8F0',
  // Traffic light risk colors
  riskGreen: '#16A34A',
  riskGreenBg: '#F0FDF4',
  riskYellow: '#CA8A04',
  riskYellowBg: '#FEFCE8',
  riskRed: '#DC2626',
  riskRedBg: '#FEF2F2',
  white: '#FFFFFF',
} as const

/**
 * Shared PDF styles for the entire inspection report.
 */
export const pdfStyles = StyleSheet.create({
  // --- Page ---
  page: {
    padding: '48pt 44pt 60pt 44pt',
    fontFamily: FONT_FAMILY,
    fontSize: 10,
    color: COLORS.text,
    backgroundColor: COLORS.background,
  },

  // --- Header / Footer ---
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 44,
    backgroundColor: COLORS.primary,
  },
  headerCompany: {
    fontSize: 9,
    fontWeight: 700,
    color: COLORS.white,
    letterSpacing: 2,
  },
  headerTitle: {
    fontSize: 8,
    color: '#CBD5E1',
    letterSpacing: 0.5,
  },
  footer: {
    position: 'absolute',
    bottom: 16,
    left: 44,
    right: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  footerText: {
    fontSize: 7,
    color: COLORS.textMuted,
    letterSpacing: 0.3,
  },
  pageNumber: {
    fontSize: 7,
    color: COLORS.textMuted,
  },

  // --- Typography ---
  h1: {
    fontSize: 26,
    fontWeight: 700,
    color: COLORS.primary,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  h2: {
    fontSize: 15,
    fontWeight: 700,
    color: COLORS.primary,
    marginBottom: 10,
    marginTop: 14,
    paddingBottom: 4,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.accent,
  },
  h3: {
    fontSize: 11,
    fontWeight: 700,
    color: COLORS.primary,
    marginBottom: 6,
    marginTop: 12,
    paddingLeft: 8,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
  },
  body: {
    fontSize: 9.5,
    lineHeight: 1.6,
    color: COLORS.text,
  },
  bodySmall: {
    fontSize: 8,
    lineHeight: 1.5,
    color: COLORS.textLight,
  },
  label: {
    fontSize: 8,
    fontWeight: 700,
    color: COLORS.textLight,
    letterSpacing: 0.5,
    marginBottom: 2,
  },

  // --- Risk badges ---
  riskBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 3,
    fontSize: 7.5,
    fontWeight: 700,
    letterSpacing: 0.3,
  },
  riskGreen: {
    backgroundColor: COLORS.riskGreen,
    color: COLORS.white,
  },
  riskYellow: {
    backgroundColor: COLORS.riskYellow,
    color: COLORS.white,
  },
  riskRed: {
    backgroundColor: COLORS.riskRed,
    color: COLORS.white,
  },

  // --- Tables ---
  table: {
    width: '100%',
    marginVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontWeight: 700,
    color: COLORS.white,
    letterSpacing: 0.3,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.borderLight,
  },
  tableRowAlt: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 8,
    backgroundColor: COLORS.backgroundAlt,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.borderLight,
  },
  tableCell: {
    fontSize: 9,
    color: COLORS.text,
  },

  // --- Photos ---
  photo: {
    maxWidth: '100%',
    maxHeight: 200,
    objectFit: 'contain',
    marginVertical: 4,
    borderRadius: 3,
  },
  photoCaption: {
    fontSize: 7.5,
    color: COLORS.textLight,
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  photoGridItem: {
    width: '48%',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: 4,
    padding: 4,
    backgroundColor: COLORS.backgroundAlt,
  },

  // --- Cost rows ---
  costRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.borderLight,
  },
  costCheckbox: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 2,
    marginRight: 8,
  },
  costCheckboxSelected: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: COLORS.riskGreen,
    backgroundColor: COLORS.riskGreen,
    borderRadius: 2,
    marginRight: 8,
  },
  costDescription: {
    flex: 1,
    fontSize: 9,
    color: COLORS.text,
  },
  costRange: {
    fontSize: 9,
    fontWeight: 700,
    color: COLORS.text,
    textAlign: 'right',
    width: 140,
  },

  // --- Section divider ---
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    marginVertical: 12,
  },
  accentBar: {
    height: 3,
    backgroundColor: COLORS.accent,
    marginVertical: 10,
    borderRadius: 2,
  },

  // --- Cover page specific ---
  coverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  coverTitle: {
    fontSize: 30,
    fontWeight: 700,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 1.5,
  },
  coverSubtitle: {
    fontSize: 13,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 30,
    letterSpacing: 0.5,
  },
  coverDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 380,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.borderLight,
  },
  coverLabel: {
    fontSize: 9,
    fontWeight: 700,
    color: COLORS.textLight,
    letterSpacing: 0.3,
  },
  coverValue: {
    fontSize: 9.5,
    color: COLORS.text,
    fontWeight: 700,
  },
})
