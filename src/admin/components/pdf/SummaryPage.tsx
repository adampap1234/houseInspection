import { Page, View, Text } from '@react-pdf/renderer'
import { pdfStyles, COLORS } from './pdfStyles.ts'
import { formatDate } from '../../lib/blob-utils.ts'
import type { Inspection, RiskScore } from '../../types/inspection.ts'

interface SummaryPageProps {
  inspection: Inspection
  risks: RiskScore[]
  photoCount: number
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
      <View style={pdfStyles.header}>
        <Text style={pdfStyles.headerCompany}>INSPECTA PRO</Text>
        <Text style={pdfStyles.headerTitle}>Osszefoglalo</Text>
      </View>

      <View style={{ marginTop: 20 }}>
        <Text style={pdfStyles.h2}>Osszefoglalo</Text>

        {/* Project overview */}
        <View style={{ marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', marginBottom: 4 }}>
            <Text style={[pdfStyles.label, { width: 100 }]}>Megbizo:</Text>
            <Text style={pdfStyles.body}>{projectData.clientName || '-'}</Text>
          </View>
          <View style={{ flexDirection: 'row', marginBottom: 4 }}>
            <Text style={[pdfStyles.label, { width: 100 }]}>Cim:</Text>
            <Text style={pdfStyles.body}>{projectData.address || '-'}</Text>
          </View>
          <View style={{ flexDirection: 'row', marginBottom: 4 }}>
            <Text style={[pdfStyles.label, { width: 100 }]}>Datum:</Text>
            <Text style={pdfStyles.body}>
              {projectData.date ? formatDate(projectData.date) : '-'}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', marginBottom: 4 }}>
            <Text style={[pdfStyles.label, { width: 100 }]}>Vizsgalo:</Text>
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
            justifyContent: 'space-around',
            marginVertical: 12,
            paddingVertical: 10,
            backgroundColor: COLORS.backgroundAlt,
            borderRadius: 6,
          }}
        >
          {/* Green */}
          <View style={{ alignItems: 'center' }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: COLORS.riskGreen,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 4,
              }}
            >
              <Text
                style={{ fontSize: 16, fontWeight: 700, color: COLORS.white }}
              >
                {rendben}
              </Text>
            </View>
            <Text style={pdfStyles.bodySmall}>Rendben</Text>
          </View>

          {/* Yellow */}
          <View style={{ alignItems: 'center' }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: COLORS.riskYellow,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 4,
              }}
            >
              <Text
                style={{ fontSize: 16, fontWeight: 700, color: COLORS.white }}
              >
                {figyelendo}
              </Text>
            </View>
            <Text style={pdfStyles.bodySmall}>Figyelendo</Text>
          </View>

          {/* Red */}
          <View style={{ alignItems: 'center' }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: COLORS.riskRed,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 4,
              }}
            >
              <Text
                style={{ fontSize: 16, fontWeight: 700, color: COLORS.white }}
              >
                {kockazatos}
              </Text>
            </View>
            <Text style={pdfStyles.bodySmall}>Kockazatos</Text>
          </View>
        </View>

        <View style={pdfStyles.divider} />

        {/* Quick stats */}
        <Text style={pdfStyles.h3}>Vizsgalat statisztikak</Text>

        <View style={{ marginTop: 6 }}>
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
            {risks
              .filter((r) => r.level === 'kockazatos')
              .map((risk) => (
                <View
                  key={risk.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 4,
                    paddingVertical: 3,
                  }}
                >
                  <View
                    style={[pdfStyles.riskBadge, pdfStyles.riskRed, { marginRight: 8 }]}
                  >
                    <Text>Kockazatos</Text>
                  </View>
                  <Text style={[pdfStyles.body, { flex: 1 }]}>
                    {risk.category}: {risk.reason}
                  </Text>
                </View>
              ))}
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
