import { Page, View, Text } from '@react-pdf/renderer'
import { pdfStyles, COLORS } from './pdfStyles.ts'
import { formatDate } from '../../lib/blob-utils.ts'
import type { ProjectData } from '../../types/inspection.ts'

interface DisclaimerPageProps {
  projectData: ProjectData
}

export function DisclaimerPage({ projectData }: DisclaimerPageProps) {
  return (
    <Page size="A4" style={pdfStyles.page}>
      {/* Header */}
      <View style={pdfStyles.header} fixed>
        <Text style={pdfStyles.headerCompany}>INSPECTA PRO</Text>
        <Text style={pdfStyles.headerTitle}>Nyilatkozat</Text>
      </View>

      <View style={{ marginTop: 20 }}>
        <Text style={pdfStyles.h2}>Nyilatkozat es felelosseg korlatozas</Text>

        <View style={pdfStyles.accentBar} />

        <View style={{ marginTop: 8, gap: 10 }}>
          <Text style={pdfStyles.body}>
            Ez a jelentes a vizsgalat idopontjaban tapasztalt allapotokat
            rogziti. A jelentes a szemmel lathato es a rendelkezesre allo
            muszerekkel merhteo allapotokat tartalmazza.
          </Text>

          <Text style={pdfStyles.body}>
            A vizsgalat nem terjed ki rejtett hibakra, amelyek a
            szerkezetek megbontasa nelkul nem felderithetok. Az epulet
            szerkezeti elemei, csovezetesei es egyeb rejtett rendszerei
            csak a lathato jelekbol kovetkeztetheto allapotukban kerultek
            ertekelesre.
          </Text>

          <Text style={pdfStyles.body}>
            A koltsegbecsles tajkoztato jellegu, valodi ajanlatot
            szakipari vallalkozotol kell kerni. A felsorolt osszegek
            iranyarak, amelyek a munka terjedelmeto1, a helyi araktol es
            az anyagvalasztastol fuggoen valtozhatnak.
          </Text>

          <Text style={pdfStyles.body}>
            A kockazati ertekeles a vizsgalat soran felvett adatokon
            alapul, es a vizsgalo szakmai megallapitasat tukrozi. Ez nem
            helyettesiti a specializalt szakertoi velemenyeket (pl.
            statikus, energetikus, elektromos felulvizsgalat).
          </Text>

          <Text style={pdfStyles.body}>
            Jelen jelentes a megbizo reszere keszult, es harmadik felnek
            nem adthato at a vizsgalo irasbeli hozzajarulasa nelkul. A
            jelentes tartalma bizalmas, es kizarolag az ingatlan
            ertekelesere hasznalhato fel.
          </Text>
        </View>

        <View style={pdfStyles.divider} />

        {/* Signature area */}
        <View style={{ marginTop: 40 }}>
          <Text style={pdfStyles.h3}>Alairas</Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 30,
            }}
          >
            {/* Inspector signature */}
            <View style={{ width: '45%' }}>
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: COLORS.text,
                  marginBottom: 6,
                  height: 40,
                }}
              />
              <Text style={pdfStyles.label}>Vizsgalo alairasa</Text>
              <Text style={pdfStyles.body}>
                {projectData.inspectorName || ''}
              </Text>
            </View>

            {/* Date and location */}
            <View style={{ width: '45%' }}>
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: COLORS.text,
                  marginBottom: 6,
                  height: 40,
                }}
              />
              <Text style={pdfStyles.label}>Hely, datum</Text>
              <Text style={pdfStyles.body}>
                {projectData.address
                  ? `${projectData.address}, `
                  : ''}
                {projectData.date
                  ? formatDate(projectData.date)
                  : ''}
              </Text>
            </View>
          </View>
        </View>
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
