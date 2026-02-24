import { Page, View, Text, Image } from '@react-pdf/renderer'
import { pdfStyles, COLORS } from './pdfStyles.ts'
import type {
  Inspection,
  ChecklistItem,
  RiskLevel,
  InspectionPhoto,
} from '../../types/inspection.ts'

/**
 * Photo with base64 data URL pre-converted from blob.
 */
export interface PhotoWithBase64 extends Omit<InspectionPhoto, 'blob'> {
  base64: string
}

interface FindingsPageProps {
  inspection: Inspection
  photos: PhotoWithBase64[]
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

function isChecklist(value: unknown): value is ChecklistItem {
  if (!value || typeof value !== 'object') return false
  const obj = value as Record<string, unknown>
  return (
    typeof obj.status === 'string' &&
    typeof obj.notes === 'string' &&
    ['rendben', 'figyelendo', 'kockazatos'].includes(obj.status as string)
  )
}

/** Labels for checklist field keys */
const FIELD_LABELS: Record<string, string> = {
  foundation: 'Alapozas',
  walls: 'Falazat',
  roof: 'Teto',
  gutters: 'Eresz / csatorna',
  grading: 'Tereprendezes',
  loadBearing: 'Teherhordo szerkezet',
  cracks: 'Repedezetteseg',
  insulation: 'Szigeteles',
  dampProofing: 'Vizszigetelesek',
  thermalBridges: 'Hohid',
  windowSeals: 'Ablak tomites',
  condition: 'Allapot',
  seals: 'Tomitesek',
  glass: 'Uveg',
  hardware: 'Vasalat',
  weatherStripping: 'Idojaras vedelem',
  panel: 'Eloszto tabla',
  wiring: 'Vezetekezese',
  outlets: 'Konnektor csatlakozok',
  grounding: 'Foldeles',
  gfci: 'FI-rele',
  heating: 'Futes',
  cooling: 'Hutes',
  ventilation: 'Szellozes',
  ductwork: 'Legcsatorna',
  thermostat: 'Termosztat',
}

const PHOTO_TYPE_LABELS: Record<string, string> = {
  visible: 'Foto',
  thermal: 'Hokep',
  other: 'Egyeb',
}

interface SectionDef {
  title: string
  stepKey: string
  dataKey: keyof Inspection
}

const SECTIONS: SectionDef[] = [
  { title: 'Kulso allapot', stepKey: 'exterior', dataKey: 'exterior' },
  { title: 'Fal / szerkezet', stepKey: 'wallStructure', dataKey: 'wallStructure' },
  { title: 'Nedvesseg / Penesz', stepKey: 'moisture', dataKey: 'moisture' },
  { title: 'Hokamera', stepKey: 'thermal', dataKey: 'thermal' },
  { title: 'Nyilaszarok', stepKey: 'windowsDoors', dataKey: 'windowsDoors' },
  { title: 'Elektromos', stepKey: 'electrical', dataKey: 'electrical' },
  { title: 'Futes / Klima', stepKey: 'hvac', dataKey: 'hvac' },
]

function ChecklistRow({ label, item }: { label: string; item: ChecklistItem }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 3,
        paddingHorizontal: 6,
        borderBottomWidth: 0.5,
        borderBottomColor: COLORS.borderLight,
      }}
      wrap={false}
    >
      <Text style={[pdfStyles.tableCell, { flex: 1 }]}>{label}</Text>
      <View style={{ width: 80 }}>
        <View style={[pdfStyles.riskBadge, getBadgeStyle(item.status)]}>
          <Text>{LEVEL_LABELS[item.status]}</Text>
        </View>
      </View>
      <Text style={[pdfStyles.tableCell, { flex: 1, marginLeft: 8 }]}>
        {item.notes || '-'}
      </Text>
    </View>
  )
}

function InlinePhotos({ sectionPhotos }: { sectionPhotos: PhotoWithBase64[] }) {
  if (sectionPhotos.length === 0) return null

  return (
    <View style={{ marginTop: 6, marginBottom: 8 }}>
      <Text style={[pdfStyles.label, { marginBottom: 4 }]}>Fenykepek:</Text>
      <View style={pdfStyles.photoGrid}>
        {sectionPhotos.map((photo) => (
          <View key={photo.id} style={pdfStyles.photoGridItem} wrap={false}>
            <Image src={photo.base64} style={pdfStyles.photo} />
            <Text style={pdfStyles.photoCaption}>
              {PHOTO_TYPE_LABELS[photo.photoType] || photo.photoType}
              {photo.roomId ? ` - ${photo.roomId}` : ''}
            </Text>
          </View>
        ))}
      </View>
    </View>
  )
}

function MoistureSection({ inspection, photos }: { inspection: Inspection; photos: PhotoWithBase64[] }) {
  const { rooms } = inspection.moisture
  const sectionPhotos = photos.filter((p) => p.stepKey === 'moisture')

  return (
    <View wrap={false}>
      <Text style={pdfStyles.h3}>Nedvesseg / Penesz</Text>
      {rooms.length === 0 ? (
        <Text style={pdfStyles.body}>Nincs rogzitett meres.</Text>
      ) : (
        rooms.map((room) => (
          <View key={room.id} style={{ marginBottom: 8 }}>
            <Text style={[pdfStyles.label, { marginTop: 4 }]}>
              {room.roomName} ({room.wallType === 'exterior' ? 'Kulso fal' : 'Belso fal'})
            </Text>
            <View style={pdfStyles.table}>
              <View style={pdfStyles.tableRow}>
                <Text style={[pdfStyles.tableCell, { flex: 1 }]}>Paratartalom</Text>
                <Text style={[pdfStyles.tableCell, { textAlign: 'right' }]}>
                  {room.relativeHumidity}%
                </Text>
              </View>
              <View style={pdfStyles.tableRowAlt}>
                <Text style={[pdfStyles.tableCell, { flex: 1 }]}>Homerseklet</Text>
                <Text style={[pdfStyles.tableCell, { textAlign: 'right' }]}>
                  {room.temperature}°C
                </Text>
              </View>
              <View style={pdfStyles.tableRow}>
                <Text style={[pdfStyles.tableCell, { flex: 1 }]}>Nedvesseg</Text>
                <Text style={[pdfStyles.tableCell, { textAlign: 'right' }]}>
                  {room.moisturePercent}%
                </Text>
              </View>
              <View style={pdfStyles.tableRowAlt}>
                <Text style={[pdfStyles.tableCell, { flex: 1 }]}>Penesz jelei</Text>
                <Text style={[pdfStyles.tableCell, { textAlign: 'right' }]}>
                  {room.moldSigns === 'none'
                    ? 'Nincs'
                    : room.moldSigns === 'suspected'
                      ? 'Gyanus'
                      : 'Lathato'}
                </Text>
              </View>
              <View style={pdfStyles.tableRow}>
                <Text style={[pdfStyles.tableCell, { flex: 1 }]}>Dohos szag</Text>
                <Text style={[pdfStyles.tableCell, { textAlign: 'right' }]}>
                  {room.mustySmell ? 'Igen' : 'Nem'}
                </Text>
              </View>
            </View>
          </View>
        ))
      )}
      <InlinePhotos sectionPhotos={sectionPhotos} />
    </View>
  )
}

function ChecklistSection({
  title,
  stepKey,
  data,
  photos,
}: {
  title: string
  stepKey: string
  data: Record<string, unknown>
  photos: PhotoWithBase64[]
}) {
  const sectionPhotos = photos.filter((p) => p.stepKey === stepKey)
  const checklistEntries = Object.entries(data).filter(([, v]) => isChecklist(v))

  return (
    <View wrap={false}>
      <Text style={pdfStyles.h3}>{title}</Text>

      {/* Checklist table header */}
      <View style={pdfStyles.tableHeader}>
        <Text style={[pdfStyles.tableHeaderCell, { flex: 1 }]}>Elem</Text>
        <Text style={[pdfStyles.tableHeaderCell, { width: 80 }]}>Allapot</Text>
        <Text style={[pdfStyles.tableHeaderCell, { flex: 1 }]}>Megjegyzes</Text>
      </View>

      {checklistEntries.map(([key, value]) => (
        <ChecklistRow
          key={key}
          label={FIELD_LABELS[key] || key}
          item={value as ChecklistItem}
        />
      ))}

      {/* Inline photos for this section */}
      <InlinePhotos sectionPhotos={sectionPhotos} />
    </View>
  )
}

function ThermalSection({
  inspection,
  photos,
}: {
  inspection: Inspection
  photos: PhotoWithBase64[]
}) {
  const { thermal } = inspection
  const sectionPhotos = photos.filter((p) => p.stepKey === 'thermal')

  // Extract numeric fields
  const thermalData = thermal as unknown as Record<string, unknown>

  return (
    <View wrap={false}>
      <Text style={pdfStyles.h3}>Hokamera</Text>

      {/* Temperature data */}
      <View style={pdfStyles.table}>
        <View style={pdfStyles.tableRow}>
          <Text style={[pdfStyles.tableCell, { flex: 1 }]}>
            Kulso homerseklet
          </Text>
          <Text style={[pdfStyles.tableCell, { textAlign: 'right' }]}>
            {thermal.exteriorTemp}°C
          </Text>
        </View>
        <View style={pdfStyles.tableRowAlt}>
          <Text style={[pdfStyles.tableCell, { flex: 1 }]}>
            Belso homerseklet
          </Text>
          <Text style={[pdfStyles.tableCell, { textAlign: 'right' }]}>
            {thermal.interiorTemp}°C
          </Text>
        </View>
        <View style={pdfStyles.tableRow}>
          <Text style={[pdfStyles.tableCell, { flex: 1 }]}>
            Homerseklet kulonbseg (Delta-T)
          </Text>
          <Text
            style={[
              pdfStyles.tableCell,
              {
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

      {/* Checklist items */}
      <View style={{ marginTop: 6 }}>
        <View style={pdfStyles.tableHeader}>
          <Text style={[pdfStyles.tableHeaderCell, { flex: 1 }]}>Elem</Text>
          <Text style={[pdfStyles.tableHeaderCell, { width: 80 }]}>Allapot</Text>
          <Text style={[pdfStyles.tableHeaderCell, { flex: 1 }]}>Megjegyzes</Text>
        </View>
        {(['thermalBridges', 'insulation', 'windowSeals'] as const).map((key) => {
          const item = thermalData[key]
          if (!isChecklist(item)) return null
          return (
            <ChecklistRow
              key={key}
              label={FIELD_LABELS[key] || key}
              item={item}
            />
          )
        })}
      </View>

      <InlinePhotos sectionPhotos={sectionPhotos} />
    </View>
  )
}

export function FindingsPage({ inspection, photos }: FindingsPageProps) {
  return (
    <Page size="A4" style={pdfStyles.page} wrap>
      {/* Header */}
      <View style={pdfStyles.header} fixed>
        <Text style={pdfStyles.headerCompany}>INSPECTA PRO</Text>
        <Text style={pdfStyles.headerTitle}>Reszletes megallapitasok</Text>
      </View>

      <View style={{ marginTop: 20 }}>
        <Text style={pdfStyles.h2}>Reszletes megallapitasok</Text>

        {SECTIONS.map((section) => {
          // Special handling for moisture and thermal
          if (section.dataKey === 'moisture') {
            return (
              <View key={section.stepKey}>
                <View style={pdfStyles.divider} />
                <MoistureSection inspection={inspection} photos={photos} />
              </View>
            )
          }

          if (section.dataKey === 'thermal') {
            return (
              <View key={section.stepKey}>
                <View style={pdfStyles.divider} />
                <ThermalSection inspection={inspection} photos={photos} />
              </View>
            )
          }

          // Standard checklist sections
          const data = inspection[section.dataKey] as unknown as Record<string, unknown>
          return (
            <View key={section.stepKey}>
              <View style={pdfStyles.divider} />
              <ChecklistSection
                title={section.title}
                stepKey={section.stepKey}
                data={data}
                photos={photos}
              />
            </View>
          )
        })}
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
