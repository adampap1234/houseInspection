import { Page, View, Text } from '@react-pdf/renderer'
import { pdfStyles, COLORS } from './pdfStyles.ts'
import { formatDate } from '../../lib/blob-utils.ts'
import type { Inspection, RiskScore } from '../../types/inspection.ts'

interface SummaryPageProps {
  inspection: Inspection
  risks: RiskScore[]
  photoCount: number
}

function StatBox({
  value,
  label,
  color,
}: {
  value: number
  label: string
  color: string
}) {
  return (
    <View
      style={{
        width: '30%',
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: COLORS.borderLight,
        backgroundColor: COLORS.backgroundAlt,
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: 700,
          color,
          marginBottom: 4,
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          fontSize: 7.5,
          fontWeight: 700,
          color: COLORS.textLight,
          letterSpacing: 0.5,
        }}
      >
        {label}
      </Text>
    </View>
  )
}

export function SummaryPage({ inspection, risks, photoCount }: SummaryPageProps) {
  const { projectData, moisture, laser } = inspection

  const rendben = risks.filter((r) => r.level === 'rendben').length
  const figyelendo = risks.filter((r) => r.level === 'figyelendo').length
  const kockazatos = risks.filter((r) => r.level === 'kockazatos').length

  const roomCount = moisture.rooms.length
  const measurementCount = laser.measurements.length

  return (
    <Page size="A4" style={pdfStyles.page}>
      {/* Header */}
      <View style={pdfStyles.header} fixed>
        <Text style={pdfStyles.headerCompany}>INSPECTA PRO</Text>
        <Text style={pdfStyles.headerTitle}>Osszefoglalo</Text>
      </View>

      <View style={{ marginTop: 24 }}>
        <Text style={pdfStyles.h2}>Osszefoglalo</Text>

        {/* Project overview — two-column layout */}
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginBottom: 8,
          }}
        >
          <View style={{ width: '50%', paddingRight: 12, marginBottom: 6 }}>
            <Text style={pdfStyles.label}>MEGBIZO</Text>
            <Text style={pdfStyles.body}>{projectData.clientName || '-'}</Text>
          </View>
          <View style={{ width: '50%', paddingLeft: 12, marginBottom: 6 }}>
            <Text style={pdfStyles.label}>CIM</Text>
            <Text style={pdfStyles.body}>{projectData.address || '-'}</Text>
          </View>
          <View style={{ width: '50%', paddingRight: 12, marginBottom: 6 }}>
            <Text style={pdfStyles.label}>DATUM</Text>
            <Text style={pdfStyles.body}>
              {projectData.date ? formatDate(projectData.date) : '-'}
            </Text>
          </View>
          <View style={{ width: '50%', paddingLeft: 12, marginBottom: 6 }}>
            <Text style={pdfStyles.label}>VIZSGALO</Text>
            <Text style={pdfStyles.body}>
              {projectData.inspectorName || '-'}
            </Text>
          </View>
        </View>

        <View style={pdfStyles.divider} />

        {/* Traffic light summary */}
        <Text style={pdfStyles.h3}>Kockazati osszesites</Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 10,
            gap: 10,
          }}
        >
          <StatBox value={rendben} label="RENDBEN" color={COLORS.riskGreen} />
          <StatBox value={figyelendo} label="FIGYELENDO" color={COLORS.riskYellow} />
          <StatBox value={kockazatos} label="KOCKAZATOS" color={COLORS.riskRed} />
        </View>

        <View style={pdfStyles.divider} />

        {/* Quick stats table */}
        <Text style={pdfStyles.h3}>Vizsgalat statisztikak</Text>

        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { flex: 1 }]}>
              Vizsgalt szobak szama
            </Text>
            <Text
              style={[
                pdfStyles.tableCell,
                { fontWeight: 700, textAlign: 'right' },
              ]}
            >
              {roomCount}
            </Text>
          </View>
          <View style={pdfStyles.tableRowAlt}>
            <Text style={[pdfStyles.tableCell, { flex: 1 }]}>
              Keszitett fenykepek
            </Text>
            <Text
              style={[
                pdfStyles.tableCell,
                { fontWeight: 700, textAlign: 'right' },
              ]}
            >
              {photoCount}
            </Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { flex: 1 }]}>
              Lezermeresek
            </Text>
            <Text
              style={[
                pdfStyles.tableCell,
                { fontWeight: 700, textAlign: 'right' },
              ]}
            >
              {measurementCount}
            </Text>
          </View>
          <View style={pdfStyles.tableRowAlt}>
            <Text style={[pdfStyles.tableCell, { flex: 1 }]}>
              Kockazati ertekelesek
            </Text>
            <Text
              style={[
                pdfStyles.tableCell,
                { fontWeight: 700, textAlign: 'right' },
              ]}
            >
              {risks.length}
            </Text>
          </View>
        </View>

        {/* Key risk findings */}
        {kockazatos > 0 && (
          <View style={{ marginTop: 14 }}>
            <Text style={pdfStyles.h3}>Kiemelt kockazatok</Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: COLORS.riskRed,
                borderRadius: 4,
                overflow: 'hidden',
                marginTop: 4,
              }}
            >
              {risks
                .filter((r) => r.level === 'kockazatos')
                .map((risk, i) => (
                  <View
                    key={risk.id}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 6,
                      paddingHorizontal: 8,
                      backgroundColor: i % 2 === 0 ? COLORS.riskRedBg : COLORS.background,
                      borderBottomWidth: 0.5,
                      borderBottomColor: COLORS.borderLight,
                    }}
                  >
                    <View
                      style={[pdfStyles.riskBadge, pdfStyles.riskRed, { marginRight: 10 }]}
                    >
                      <Text>Kockazatos</Text>
                    </View>
                    <Text style={[pdfStyles.body, { flex: 1 }]}>
                      {risk.category}: {risk.reason}
                    </Text>
                  </View>
                ))}
            </View>
          </View>
        )}
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
