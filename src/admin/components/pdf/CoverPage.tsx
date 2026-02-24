import { Page, View, Text } from '@react-pdf/renderer'
import { pdfStyles, COLORS } from './pdfStyles.ts'
import { formatDate } from '../../lib/blob-utils.ts'
import type { ProjectData } from '../../types/inspection.ts'

interface CoverPageProps {
  projectData: ProjectData
}

export function CoverPage({ projectData }: CoverPageProps) {
  return (
    <Page size="A4" style={{ fontFamily: 'Inter', backgroundColor: COLORS.background }}>
      {/* Top navy band */}
      <View
        style={{
          height: 180,
          backgroundColor: COLORS.primary,
          justifyContent: 'flex-end',
          paddingHorizontal: 48,
          paddingBottom: 28,
        }}
      >
        <Text
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: COLORS.white,
            letterSpacing: 4,
            marginBottom: 8,
          }}
        >
          INSPECTA PRO
        </Text>
        <View
          style={{
            width: 48,
            height: 3,
            backgroundColor: COLORS.accent,
            borderRadius: 2,
          }}
        />
      </View>

      {/* Main content area */}
      <View style={{ flex: 1, paddingHorizontal: 48, paddingTop: 48 }}>
        {/* Title block */}
        <Text
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: COLORS.primary,
            letterSpacing: 1,
            marginBottom: 6,
          }}
        >
          Inspekcio{'\u0301'}s
        </Text>
        <Text
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: COLORS.primary,
            letterSpacing: 1,
            marginBottom: 10,
          }}
        >
          Jelente{'\u0301'}s
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: COLORS.textLight,
            letterSpacing: 0.5,
            marginBottom: 40,
          }}
        >
          Ingatlan muoszaki vizsgalat
        </Text>

        {/* Accent line */}
        <View
          style={{
            width: 60,
            height: 2,
            backgroundColor: COLORS.accent,
            borderRadius: 1,
            marginBottom: 32,
          }}
        />

        {/* Project details */}
        <View style={{ maxWidth: 360 }}>
          {projectData.clientName ? (
            <View style={pdfStyles.coverDetail}>
              <Text style={pdfStyles.coverLabel}>MEGBIZO</Text>
              <Text style={pdfStyles.coverValue}>
                {projectData.clientName}
              </Text>
            </View>
          ) : null}

          {projectData.address ? (
            <View style={pdfStyles.coverDetail}>
              <Text style={pdfStyles.coverLabel}>CIM</Text>
              <Text style={pdfStyles.coverValue}>
                {projectData.address}
              </Text>
            </View>
          ) : null}

          {projectData.date ? (
            <View style={pdfStyles.coverDetail}>
              <Text style={pdfStyles.coverLabel}>DATUM</Text>
              <Text style={pdfStyles.coverValue}>
                {formatDate(projectData.date)}
              </Text>
            </View>
          ) : null}

          {projectData.inspectorName ? (
            <View style={pdfStyles.coverDetail}>
              <Text style={pdfStyles.coverLabel}>VIZSGALO</Text>
              <Text style={pdfStyles.coverValue}>
                {projectData.inspectorName}
              </Text>
            </View>
          ) : null}

          {projectData.projectType ? (
            <View style={pdfStyles.coverDetail}>
              <Text style={pdfStyles.coverLabel}>PROJEKT TIPUS</Text>
              <Text style={pdfStyles.coverValue}>
                {projectData.projectType}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* Bottom bar */}
      <View
        style={{
          paddingHorizontal: 48,
          paddingVertical: 16,
          borderTopWidth: 1,
          borderTopColor: COLORS.borderLight,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 7, color: COLORS.textMuted, letterSpacing: 0.3 }}>
          Inspecta Pro | Ingatlan muoszaki vizsgalat
        </Text>
        <Text style={{ fontSize: 7, color: COLORS.textMuted }}>
          Bizalmas dokumentum
        </Text>
      </View>
    </Page>
  )
}
