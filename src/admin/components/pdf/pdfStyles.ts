import { StyleSheet } from '@react-pdf/renderer'
import { FONT_FAMILY } from './fonts.ts'

/**
 * Brand colors matching the warm/earthy inspection app theme.
 */
export const COLORS = {
  primary: '#8B7355',
  primaryDark: '#6B5740',
  accent: '#D97706',
  accentLight: '#F59E0B',
  text: '#1C1917',
  textLight: '#57534E',
  textMuted: '#A8A29E',
  background: '#FFFFFF',
  backgroundAlt: '#F5F5F4',
  border: '#D6D3D1',
  borderLight: '#E7E5E4',
  // Traffic light risk colors
  riskGreen: '#22C55E',
  riskYellow: '#EAB308',
  riskRed: '#EF4444',
  white: '#FFFFFF',
} as const

/**
 * Shared PDF styles for the entire inspection report.
 */
export const pdfStyles = StyleSheet.create({
  // --- Page ---
  page: {
    padding: '40pt 40pt 60pt 40pt',
    fontFamily: FONT_FAMILY,
    fontSize: 10,
    color: COLORS.text,
    backgroundColor: COLORS.background,
  },

  // --- Header / Footer ---
  header: {
    position: 'absolute',
    top: 12,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 6,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  headerCompany: {
    fontSize: 8,
    fontWeight: 700,
    color: COLORS.primary,
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 7,
    color: COLORS.textMuted,
  },
  footer: {
    position: 'absolute',
    bottom: 16,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  footerText: {
    fontSize: 7,
    color: COLORS.textMuted,
  },
  pageNumber: {
    fontSize: 7,
    color: COLORS.textMuted,
  },

  // --- Typography ---
  h1: {
    fontSize: 24,
    fontWeight: 700,
    color: COLORS.primary,
    marginBottom: 8,
  },
  h2: {
    fontSize: 16,
    fontWeight: 700,
    color: COLORS.text,
    marginBottom: 6,
    marginTop: 14,
  },
  h3: {
    fontSize: 12,
    fontWeight: 700,
    color: COLORS.primaryDark,
    marginBottom: 4,
    marginTop: 10,
  },
  body: {
    fontSize: 10,
    lineHeight: 1.5,
    color: COLORS.text,
  },
  bodySmall: {
    fontSize: 8,
    lineHeight: 1.4,
    color: COLORS.textLight,
  },
  label: {
    fontSize: 9,
    fontWeight: 700,
    color: COLORS.textLight,
    marginBottom: 2,
  },

  // --- Risk badges ---
  riskBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
    fontSize: 8,
    fontWeight: 700,
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
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontWeight: 700,
    color: COLORS.white,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.borderLight,
  },
  tableRowAlt: {
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 6,
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
  },
  photoCaption: {
    fontSize: 8,
    color: COLORS.textLight,
    marginBottom: 8,
    textAlign: 'center',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  photoGridItem: {
    width: '48%',
    marginBottom: 8,
  },

  // --- Cost rows ---
  costRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 6,
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
    borderBottomColor: COLORS.border,
    marginVertical: 10,
  },
  accentBar: {
    height: 4,
    backgroundColor: COLORS.primary,
    marginVertical: 8,
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
    fontSize: 32,
    fontWeight: 700,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 2,
  },
  coverSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 30,
  },
  coverDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 350,
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.borderLight,
  },
  coverLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: COLORS.textLight,
  },
  coverValue: {
    fontSize: 10,
    color: COLORS.text,
  },
})
