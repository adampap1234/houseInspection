import { Document } from '@react-pdf/renderer'
import './fonts.ts' // Side-effect: registers Inter font
import { CoverPage } from './CoverPage.tsx'
import { SummaryPage } from './SummaryPage.tsx'
import { RiskListPage } from './RiskListPage.tsx'
import { FindingsPage, type PhotoWithBase64 } from './FindingsPage.tsx'
import { PhotoPage } from './PhotoPage.tsx'
import { MeasurementsPage } from './MeasurementsPage.tsx'
import { CostEstimatePage } from './CostEstimatePage.tsx'
import { DisclaimerPage } from './DisclaimerPage.tsx'
import type { Inspection, RiskScore } from '../../types/inspection.ts'

interface ReportDocumentProps {
  inspection: Inspection
  photos: PhotoWithBase64[]
  risks: RiskScore[]
}

/**
 * Maximum number of photos displayed inline per section in FindingsPage.
 * Photos beyond this count go to the overflow PhotoPage.
 */
const MAX_INLINE_PHOTOS_PER_SECTION = 4

/**
 * Root PDF Document component assembling all pages of the inspection report.
 *
 * Page order:
 *   1. Cover page
 *   2. Executive summary
 *   3. Risk list
 *   4. Detailed findings (with inline photos)
 *   5. Additional photos (overflow only)
 *   6. Measurements
 *   7. Cost estimate
 *   8. Disclaimer
 */
export function ReportDocument({
  inspection,
  photos,
  risks,
}: ReportDocumentProps) {
  // Split photos: inline (shown in FindingsPage) vs overflow (shown in PhotoPage)
  const stepPhotoCount = new Map<string, number>()
  const inlinePhotos: PhotoWithBase64[] = []
  const overflowPhotos: PhotoWithBase64[] = []

  for (const photo of photos) {
    const count = stepPhotoCount.get(photo.stepKey) ?? 0
    if (count < MAX_INLINE_PHOTOS_PER_SECTION) {
      inlinePhotos.push(photo)
      stepPhotoCount.set(photo.stepKey, count + 1)
    } else {
      overflowPhotos.push(photo)
    }
  }

  return (
    <Document
      title={`Inspekcio - ${inspection.projectData.clientName || 'Jelentes'}`}
      author={inspection.projectData.inspectorName || 'Inspecta Pro'}
      subject="Ingatlan muoszaki vizsgalat"
      language="hu"
    >
      <CoverPage projectData={inspection.projectData} />
      <SummaryPage
        inspection={inspection}
        risks={risks}
        photoCount={photos.length}
      />
      <RiskListPage risks={risks} />
      <FindingsPage inspection={inspection} photos={inlinePhotos} />
      {overflowPhotos.length > 0 && <PhotoPage photos={overflowPhotos} />}
      <MeasurementsPage inspection={inspection} />
      <CostEstimatePage costItems={inspection.costItems} />
      <DisclaimerPage projectData={inspection.projectData} />
    </Document>
  )
}
