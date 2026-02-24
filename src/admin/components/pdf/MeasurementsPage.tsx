import { Page, View, Text } from '@react-pdf/renderer'
import { pdfStyles, COLORS } from './pdfStyles.ts'
import type { Inspection } from '../../types/inspection.ts'

interface MeasurementsPageProps {
  inspection: Inspection
}

export function MeasurementsPage({ inspection }: MeasurementsPageProps) {
  const { laser, thermal, moisture } = inspection
  const hasLaser = laser.measurements.length > 0
  const hasRooms = moisture.rooms.length > 0

  return (
    <Page size="A4" style={pdfStyles.page} wrap>
      {/* Header */}
      <View style={pdfStyles.header} fixed>
        <Text style={pdfStyles.headerCompany}>INSPECTA PRO</Text>
        <Text style={pdfStyles.headerTitle}>Meresek</Text>
      </View>

      <View style={{ marginTop: 24 }}>
        <Text style={pdfStyles.h2}>Meresi eredmenyek</Text>

        {/* Laser measurements */}
        <Text style={pdfStyles.h3}>Lezermeresek</Text>

        {!hasLaser ? (
          <Text style={pdfStyles.body}>Nincs rogzitett lezermeres.</Text>
        ) : (
          <View style={pdfStyles.table}>
            {/* Table header */}
            <View style={pdfStyles.tableHeader}>
              <Text style={[pdfStyles.tableHeaderCell, { flex: 1 }]}>
                Helyszin
              </Text>
              <Text style={[pdfStyles.tableHeaderCell, { width: 100 }]}>
                Meresi irany
              </Text>
              <Text
                style={[
                  pdfStyles.tableHeaderCell,
                  { width: 60, textAlign: 'right' },
                ]}
              >
                Ertek
              </Text>
              <Text
                style={[
                  pdfStyles.tableHeaderCell,
                  { width: 40, textAlign: 'center' },
                ]}
              >
                Egyseg
              </Text>
              <Text style={[pdfStyles.tableHeaderCell, { flex: 1 }]}>
                Megjegyzes
              </Text>
            </View>

            {/* Data rows */}
            {laser.measurements.map((m, index) => (
              <View
                key={m.id}
                style={
                  index % 2 === 0 ? pdfStyles.tableRow : pdfStyles.tableRowAlt
                }
                wrap={false}
              >
                <Text style={[pdfStyles.tableCell, { flex: 1 }]}>
                  {m.location}
                </Text>
                <Text style={[pdfStyles.tableCell, { width: 100 }]}>
                  {m.dimension}
                </Text>
                <Text
                  style={[
                    pdfStyles.tableCell,
                    { width: 60, textAlign: 'right', fontWeight: 700 },
                  ]}
                >
                  {m.value}
                </Text>
                <Text
                  style={[
                    pdfStyles.tableCell,
                    { width: 40, textAlign: 'center' },
                  ]}
                >
                  {m.unit}
                </Text>
                <Text style={[pdfStyles.tableCell, { flex: 1 }]}>
                  {m.notes || '-'}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={pdfStyles.divider} />

        {/* Thermal data */}
        <Text style={pdfStyles.h3}>Homerseklet adatok</Text>

        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableHeader}>
            <Text style={[pdfStyles.tableHeaderCell, { flex: 1 }]}>
              Parameter
            </Text>
            <Text
              style={[
                pdfStyles.tableHeaderCell,
                { width: 100, textAlign: 'right' },
              ]}
            >
              Ertek
            </Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { flex: 1 }]}>
              Kulso homerseklet
            </Text>
            <Text
              style={[pdfStyles.tableCell, { width: 100, textAlign: 'right' }]}
            >
              {thermal.exteriorTemp}°C
            </Text>
          </View>
          <View style={pdfStyles.tableRowAlt}>
            <Text style={[pdfStyles.tableCell, { flex: 1 }]}>
              Belso homerseklet
            </Text>
            <Text
              style={[pdfStyles.tableCell, { width: 100, textAlign: 'right' }]}
            >
              {thermal.interiorTemp}°C
            </Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { flex: 1 }]}>
              Delta-T
            </Text>
            <Text
              style={[
                pdfStyles.tableCell,
                {
                  width: 100,
                  textAlign: 'right',
                  fontWeight: 700,
                  color:
                    thermal.deltaT > 5
                      ? COLORS.riskRed
                      : thermal.deltaT >= 3
                        ? COLORS.riskYellow
                        : COLORS.riskGreen,
                },
              ]}
            >
              {thermal.deltaT}°C
            </Text>
          </View>
        </View>

        <View style={pdfStyles.divider} />

        {/* Moisture data per room */}
        <Text style={pdfStyles.h3}>Nedvesseg adatok szobanken</Text>

        {!hasRooms ? (
          <Text style={pdfStyles.body}>Nincs rogzitett szoba adat.</Text>
        ) : (
          <View style={pdfStyles.table}>
            <View style={pdfStyles.tableHeader}>
              <Text style={[pdfStyles.tableHeaderCell, { flex: 1 }]}>
                Szoba
              </Text>
              <Text
                style={[
                  pdfStyles.tableHeaderCell,
                  { width: 60, textAlign: 'right' },
                ]}
              >
                Paratar.
              </Text>
              <Text
                style={[
                  pdfStyles.tableHeaderCell,
                  { width: 50, textAlign: 'right' },
                ]}
              >
                Hom.
              </Text>
              <Text
                style={[
                  pdfStyles.tableHeaderCell,
                  { width: 60, textAlign: 'right' },
                ]}
              >
                Nedv. %
              </Text>
              <Text
                style={[
                  pdfStyles.tableHeaderCell,
                  { width: 60, textAlign: 'center' },
                ]}
              >
                Penesz
              </Text>
            </View>

            {moisture.rooms.map((room, index) => (
              <View
                key={room.id}
                style={
                  index % 2 === 0
                    ? pdfStyles.tableRow
                    : pdfStyles.tableRowAlt
                }
                wrap={false}
              >
                <Text style={[pdfStyles.tableCell, { flex: 1 }]}>
                  {room.roomName}
                </Text>
                <Text
                  style={[
                    pdfStyles.tableCell,
                    { width: 60, textAlign: 'right' },
                  ]}
                >
                  {room.relativeHumidity}%
                </Text>
                <Text
                  style={[
                    pdfStyles.tableCell,
                    { width: 50, textAlign: 'right' },
                  ]}
                >
                  {room.temperature}°C
                </Text>
                <Text
                  style={[
                    pdfStyles.tableCell,
                    { width: 60, textAlign: 'right' },
                  ]}
                >
                  {room.moisturePercent}%
                </Text>
                <Text
                  style={[
                    pdfStyles.tableCell,
                    {
                      width: 60,
                      textAlign: 'center',
                      color:
                        room.moldSigns === 'visible'
                          ? COLORS.riskRed
                          : room.moldSigns === 'suspected'
                            ? COLORS.riskYellow
                            : COLORS.text,
                    },
                  ]}
                >
                  {room.moldSigns === 'none'
                    ? 'Nincs'
                    : room.moldSigns === 'suspected'
                      ? 'Gyanus'
                      : 'Lathato'}
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
