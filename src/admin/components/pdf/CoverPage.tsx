import { Page, View, Text } from '@react-pdf/renderer'
import { pdfStyles, COLORS } from './pdfStyles.ts'
import { formatDate } from '../../lib/blob-utils.ts'
import type { ProjectData } from '../../types/inspection.ts'

interface CoverPageProps {
  projectData: ProjectData
}

export function CoverPage({ projectData }: CoverPageProps) {
  return (
    <Page size="A4" style={pdfStyles.page}>
      <View style={pdfStyles.coverContainer}>
        {/* Company name / logo placeholder */}
        <Text
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: COLORS.primary,
            letterSpacing: 3,
            marginBottom: 40,
          }}
        >
          INSPECTA PRO
        </Text>

        {/* Accent bar */}
        <View
          style={{
            width: 80,
            height: 4,
            backgroundColor: COLORS.accent,
            borderRadius: 2,
            marginBottom: 30,
          }}
        />

        {/* Main title */}
        <Text style={pdfStyles.coverTitle}>
          INSPEKCIO{'\u0301'}S JELENTE{'\u0301'}S
        </Text>

        <Text style={pdfStyles.coverSubtitle}>
          Ingatlan muoszaki vizsgalat
        </Text>

        {/* Accent bar */}
        <View
          style={{
            width: 200,
            height: 2,
            backgroundColor: COLORS.primary,
            marginBottom: 40,
          }}
        />

        {/* Project details */}
        <View style={{ width: '100%', maxWidth: 350 }}>
          {projectData.clientName ? (
            <View style={pdfStyles.coverDetail}>
              <Text style={pdfStyles.coverLabel}>Megbizo:</Text>
              <Text style={pdfStyles.coverValue}>
                {projectData.clientName}
              </Text>
            </View>
          ) : null}

          {projectData.address ? (
            <View style={pdfStyles.coverDetail}>
              <Text style={pdfStyles.coverLabel}>Cim:</Text>
              <Text style={pdfStyles.coverValue}>
                {projectData.address}
              </Text>
            </View>
          ) : null}

          {projectData.date ? (
            <View style={pdfStyles.coverDetail}>
              <Text style={pdfStyles.coverLabel}>Datum:</Text>
              <Text style={pdfStyles.coverValue}>
                {formatDate(projectData.date)}
              </Text>
            </View>
          ) : null}

          {projectData.inspectorName ? (
            <View style={pdfStyles.coverDetail}>
              <Text style={pdfStyles.coverLabel}>Vizsgalo:</Text>
              <Text style={pdfStyles.coverValue}>
                {projectData.inspectorName}
              </Text>
            </View>
          ) : null}

          {projectData.projectType ? (
            <View style={pdfStyles.coverDetail}>
              <Text style={pdfStyles.coverLabel}>Projekt tipus:</Text>
              <Text style={pdfStyles.coverValue}>
                {projectData.projectType}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Bottom accent bar */}
        <View
          style={{
            width: 80,
            height: 4,
            backgroundColor: COLORS.accent,
            borderRadius: 2,
            marginTop: 60,
          }}
        />
      </View>
    </Page>
  )
}
