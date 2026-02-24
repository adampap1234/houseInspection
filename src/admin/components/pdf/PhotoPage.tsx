import { Page, View, Text, Image } from '@react-pdf/renderer'
import { pdfStyles } from './pdfStyles.ts'
import type { PhotoWithBase64 } from './FindingsPage.tsx'

interface PhotoPageProps {
  /** Overflow photos not shown inline in FindingsPage */
  photos: PhotoWithBase64[]
}

const STEP_LABELS: Record<string, string> = {
  projectData: 'Projekt',
  exterior: 'Kulso allapot',
  wallStructure: 'Fal / szerkezet',
  moisture: 'Nedvesseg',
  thermal: 'Hokamera',
  windowsDoors: 'Nyilaszarok',
  electrical: 'Elektromos',
  hvac: 'Futes / Klima',
  laser: 'Lezermeresek',
}

const PHOTO_TYPE_LABELS: Record<string, string> = {
  visible: 'Foto',
  thermal: 'Hokep',
  other: 'Egyeb',
}

/**
 * Additional photo documentation page. Only rendered if there are
 * overflow photos that didn't fit inline in the FindingsPage.
 */
export function PhotoPage({ photos }: PhotoPageProps) {
  if (photos.length === 0) return null

  // Group by stepKey
  const grouped = new Map<string, PhotoWithBase64[]>()
  for (const photo of photos) {
    const key = photo.stepKey
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key)!.push(photo)
  }

  return (
    <Page size="A4" style={pdfStyles.page} wrap>
      {/* Header */}
      <View style={pdfStyles.header} fixed>
        <Text style={pdfStyles.headerCompany}>INSPECTA PRO</Text>
        <Text style={pdfStyles.headerTitle}>Fenykep dokumentacio</Text>
      </View>

      <View style={{ marginTop: 20 }}>
        <Text style={pdfStyles.h2}>Tovabbi fenykepek</Text>

        {Array.from(grouped.entries()).map(([stepKey, stepPhotos]) => (
          <View key={stepKey} style={{ marginBottom: 12 }}>
            <Text style={pdfStyles.h3}>
              {STEP_LABELS[stepKey] || stepKey}
            </Text>

            <View style={pdfStyles.photoGrid}>
              {stepPhotos.map((photo) => (
                <View
                  key={photo.id}
                  style={pdfStyles.photoGridItem}
                  wrap={false}
                >
                  <Image src={photo.base64} style={pdfStyles.photo} />
                  <Text style={pdfStyles.photoCaption}>
                    {PHOTO_TYPE_LABELS[photo.photoType] || photo.photoType}
                    {photo.roomId ? ` - ${photo.roomId}` : ''}
                  </Text>
                </View>
              ))}
            </View>
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
