import { Page, View, Text } from '@react-pdf/renderer'
import { pdfStyles, COLORS } from './pdfStyles.ts'
import type { RiskScore, RiskLevel } from '../../types/inspection.ts'

interface RiskListPageProps {
  risks: RiskScore[]
}

const LEVEL_ORDER: Record<RiskLevel, number> = {
  kockazatos: 0,
  figyelendo: 1,
  rendben: 2,
}

const LEVEL_LABELS: Record<RiskLevel, string> = {
  rendben: 'Rendben',
  figyelendo: 'Figyelendo',
  kockazatos: 'Kockazatos',
}

function getBadgeStyle(level: RiskLevel) {
  switch (level) {
    case 'kockazatos':
      return pdfStyles.riskRed
    case 'figyelendo':
      return pdfStyles.riskYellow
    case 'rendben':
      return pdfStyles.riskGreen
  }
}

function getRowBg(level: RiskLevel): string {
  switch (level) {
    case 'kockazatos':
      return '#FEF2F2'
    case 'figyelendo':
      return '#FEFCE8'
    default:
      return COLORS.background
  }
}

export function RiskListPage({ risks }: RiskListPageProps) {
  const sorted = [...risks].sort(
    (a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level]
  )

  return (
    <Page size="A4" style={pdfStyles.page} wrap>
      {/* Header */}
      <View style={pdfStyles.header} fixed>
        <Text style={pdfStyles.headerCompany}>INSPECTA PRO</Text>
        <Text style={pdfStyles.headerTitle}>Kockazati lista</Text>
      </View>

      <View style={{ marginTop: 20 }}>
        <Text style={pdfStyles.h2}>Kockazati ertekelesek</Text>
        <Text style={[pdfStyles.bodySmall, { marginBottom: 8 }]}>
          Osszes kockazat: {risks.length} | Kockazatos:{' '}
          {risks.filter((r) => r.level === 'kockazatos').length} | Figyelendo:{' '}
          {risks.filter((r) => r.level === 'figyelendo').length} | Rendben:{' '}
          {risks.filter((r) => r.level === 'rendben').length}
        </Text>

        {/* Table header */}
        <View style={pdfStyles.tableHeader}>
          <Text style={[pdfStyles.tableHeaderCell, { width: 120 }]}>
            Kategoria
          </Text>
          <Text style={[pdfStyles.tableHeaderCell, { width: 80 }]}>Szint</Text>
          <Text style={[pdfStyles.tableHeaderCell, { flex: 1 }]}>Ok</Text>
          <Text style={[pdfStyles.tableHeaderCell, { width: 60, textAlign: 'center' }]}>
            Modositott
          </Text>
        </View>

        {/* Table rows */}
        {sorted.map((risk, index) => (
          <View
            key={risk.id}
            style={[
              index % 2 === 0 ? pdfStyles.tableRow : pdfStyles.tableRowAlt,
              { backgroundColor: getRowBg(risk.level) },
            ]}
            wrap={false}
          >
            <Text style={[pdfStyles.tableCell, { width: 120 }]}>
              {risk.category}
            </Text>
            <View style={{ width: 80 }}>
              <View style={[pdfStyles.riskBadge, getBadgeStyle(risk.level)]}>
                <Text>{LEVEL_LABELS[risk.level]}</Text>
              </View>
            </View>
            <Text style={[pdfStyles.tableCell, { flex: 1 }]}>
              {risk.reason}
            </Text>
            <Text
              style={[
                pdfStyles.tableCell,
                { width: 60, textAlign: 'center' },
              ]}
            >
              {risk.manuallyAdjusted ? 'Igen' : '-'}
            </Text>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={pdfStyles.footer} fixed>
        <Text style={pdfStyles.footerText}>
          Inspecta Pro | Ingatlan muoszaki vizsgalat
        </Text>
        <Text
          style={pdfStyles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
        />
      </View>
    </Page>
  )
}
