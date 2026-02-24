import { Page, View, Text } from '@react-pdf/renderer'
import { pdfStyles, COLORS } from './pdfStyles.ts'
import { formatHuf } from '../../lib/blob-utils.ts'
import type { CostItem } from '../../types/inspection.ts'

interface CostEstimatePageProps {
  costItems: CostItem[]
}

export function CostEstimatePage({ costItems }: CostEstimatePageProps) {
  const selectedItems = costItems.filter((item) => item.selected)

  // Group by category
  const categories = new Map<string, CostItem[]>()
  for (const item of selectedItems) {
    if (!categories.has(item.category)) {
      categories.set(item.category, [])
    }
    categories.get(item.category)!.push(item)
  }

  // Grand totals
  const grandMin = selectedItems.reduce((sum, i) => sum + i.minCostHuf, 0)
  const grandMax = selectedItems.reduce((sum, i) => sum + i.maxCostHuf, 0)

  return (
    <Page size="A4" style={pdfStyles.page} wrap>
      {/* Header */}
      <View style={pdfStyles.header} fixed>
        <Text style={pdfStyles.headerCompany}>INSPECTA PRO</Text>
        <Text style={pdfStyles.headerTitle}>Koltsegbecsles</Text>
      </View>

      <View style={{ marginTop: 24 }}>
        <Text style={pdfStyles.h2}>Becsult javitasi koltsegek</Text>

        {selectedItems.length === 0 ? (
          <Text style={pdfStyles.body}>
            Nem kerultek tetelek kivalasztasra a koltsegbecslesben.
          </Text>
        ) : (
          <>
            {/* Per-category groups */}
            {Array.from(categories.entries()).map(
              ([category, items]) => {
                const catMin = items.reduce(
                  (sum, i) => sum + i.minCostHuf,
                  0
                )
                const catMax = items.reduce(
                  (sum, i) => sum + i.maxCostHuf,
                  0
                )

                return (
                  <View key={category} style={{ marginBottom: 12 }}>
                    <Text style={pdfStyles.h3}>{category}</Text>

                    {/* Items */}
                    {items.map((item) => (
                      <View
                        key={item.id}
                        style={pdfStyles.costRow}
                        wrap={false}
                      >
                        <View style={pdfStyles.costCheckboxSelected} />
                        <Text style={pdfStyles.costDescription}>
                          {item.description}
                        </Text>
                        <Text style={pdfStyles.costRange}>
                          {formatHuf(item.minCostHuf)} -{' '}
                          {formatHuf(item.maxCostHuf)}
                        </Text>
                      </View>
                    ))}

                    {/* Category subtotal */}
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        paddingVertical: 5,
                        paddingHorizontal: 8,
                        backgroundColor: COLORS.backgroundAccent,
                        borderBottomWidth: 1,
                        borderBottomColor: COLORS.border,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          color: COLORS.textLight,
                          marginRight: 8,
                        }}
                      >
                        Reszosszeg:
                      </Text>
                      <Text
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          color: COLORS.text,
                          width: 140,
                          textAlign: 'right',
                        }}
                      >
                        {formatHuf(catMin)} - {formatHuf(catMax)}
                      </Text>
                    </View>
                  </View>
                )
              }
            )}

            {/* Grand total */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
                marginTop: 14,
                paddingVertical: 10,
                paddingHorizontal: 8,
                backgroundColor: COLORS.primary,
                borderRadius: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: COLORS.white,
                  marginRight: 12,
                }}
              >
                Becsult osszkoltseg:
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: COLORS.white,
                }}
              >
                {formatHuf(grandMin)} - {formatHuf(grandMax)}
              </Text>
            </View>
          </>
        )}

        {/* Disclaimer */}
        <View style={{ marginTop: 18 }}>
          <View style={pdfStyles.divider} />
          <Text style={[pdfStyles.bodySmall, { marginTop: 8 }]}>
            A koltsegbecsles tajkoztato jellegu. A felsorolt osszegek
            iranyarak, amelyek a munka terjedelmeto1, a helyi araktol es az
            anyagvalasztastol fuggoen valtozhatnak. Valodi ajanlatot
            szakipari vallalkozotol kell kerni.
          </Text>
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
