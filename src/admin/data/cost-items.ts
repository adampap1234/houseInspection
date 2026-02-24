import type { CostItem } from '../types/inspection.ts'

/**
 * Predefined cost item catalog with Hungarian descriptions and HUF ranges.
 * These are magnitude-range estimates, NOT exact quotes.
 */
export const COST_ITEM_CATALOG: Omit<CostItem, 'selected'>[] = [
  // --- Hoszigeteles (Thermal insulation) ---
  {
    id: 'thermal-bridge-fix',
    category: 'Hoszigeteles',
    description: 'Hohid javitas',
    minCostHuf: 300_000,
    maxCostHuf: 800_000,
  },
  {
    id: 'facade-insulation',
    category: 'Hoszigeteles',
    description: 'Homlokzati szigeteles',
    minCostHuf: 2_000_000,
    maxCostHuf: 5_000_000,
  },
  {
    id: 'roof-insulation',
    category: 'Hoszigeteles',
    description: 'Teto szigeteles',
    minCostHuf: 800_000,
    maxCostHuf: 2_500_000,
  },
  {
    id: 'floor-insulation',
    category: 'Hoszigeteles',
    description: 'Padlo szigeteles',
    minCostHuf: 500_000,
    maxCostHuf: 1_500_000,
  },

  // --- Nedvesseg (Moisture) ---
  {
    id: 'waterproofing-repair',
    category: 'Nedvesseg',
    description: 'Vizszigeteles javitas',
    minCostHuf: 200_000,
    maxCostHuf: 600_000,
  },
  {
    id: 'mold-remediation',
    category: 'Nedvesseg',
    description: 'Peneszmentesites',
    minCostHuf: 100_000,
    maxCostHuf: 400_000,
  },
  {
    id: 'drainage-fix',
    category: 'Nedvesseg',
    description: 'Vizelvezetes javitas',
    minCostHuf: 300_000,
    maxCostHuf: 1_000_000,
  },
  {
    id: 'damp-proofing',
    category: 'Nedvesseg',
    description: 'Falnedvesseg elleni vedelem',
    minCostHuf: 400_000,
    maxCostHuf: 1_200_000,
  },

  // --- Nyilaszarok (Windows / Doors) ---
  {
    id: 'window-replacement',
    category: 'Nyilaszarok',
    description: 'Ablakcsere (db)',
    minCostHuf: 150_000,
    maxCostHuf: 400_000,
  },
  {
    id: 'seal-replacement',
    category: 'Nyilaszarok',
    description: 'Tomites csere (db)',
    minCostHuf: 30_000,
    maxCostHuf: 80_000,
  },
  {
    id: 'door-replacement',
    category: 'Nyilaszarok',
    description: 'Ajtocsere (db)',
    minCostHuf: 100_000,
    maxCostHuf: 350_000,
  },

  // --- Elektromos (Electrical) ---
  {
    id: 'panel-replacement',
    category: 'Elektromos',
    description: 'Eloszto csere',
    minCostHuf: 200_000,
    maxCostHuf: 500_000,
  },
  {
    id: 'rewiring',
    category: 'Elektromos',
    description: 'Vezetekezese felujitas',
    minCostHuf: 500_000,
    maxCostHuf: 2_000_000,
  },
  {
    id: 'grounding-fix',
    category: 'Elektromos',
    description: 'Foldeles kiepites/javitas',
    minCostHuf: 100_000,
    maxCostHuf: 300_000,
  },

  // --- Futes / Klima (HVAC) ---
  {
    id: 'boiler-replacement',
    category: 'Futes / Klima',
    description: 'Kazancsere',
    minCostHuf: 400_000,
    maxCostHuf: 1_200_000,
  },
  {
    id: 'ac-installation',
    category: 'Futes / Klima',
    description: 'Klima telepites',
    minCostHuf: 250_000,
    maxCostHuf: 600_000,
  },
  {
    id: 'radiator-replacement',
    category: 'Futes / Klima',
    description: 'Radiator csere',
    minCostHuf: 80_000,
    maxCostHuf: 250_000,
  },
  {
    id: 'duct-cleaning',
    category: 'Futes / Klima',
    description: 'Legcsatorna tisztitas',
    minCostHuf: 50_000,
    maxCostHuf: 150_000,
  },

  // --- Szerkezet (Structure) ---
  {
    id: 'crack-repair',
    category: 'Szerkezet',
    description: 'Repedes javitas',
    minCostHuf: 100_000,
    maxCostHuf: 500_000,
  },
  {
    id: 'foundation-reinforcement',
    category: 'Szerkezet',
    description: 'Alapozas megerosites',
    minCostHuf: 1_000_000,
    maxCostHuf: 5_000_000,
  },
  {
    id: 'wall-repair',
    category: 'Szerkezet',
    description: 'Faljavitas',
    minCostHuf: 200_000,
    maxCostHuf: 800_000,
  },
  {
    id: 'roof-repair',
    category: 'Szerkezet',
    description: 'Tetojavitas',
    minCostHuf: 300_000,
    maxCostHuf: 1_500_000,
  },
]

/**
 * Returns a fresh copy of the catalog with `selected: false` on each item,
 * suitable for initializing the cost estimation form.
 */
export function getDefaultCostItems(): CostItem[] {
  return COST_ITEM_CATALOG.map((item) => ({ ...item, selected: false }))
}

/**
 * Returns unique categories from the catalog, in order of first appearance.
 */
export function getCostCategories(): string[] {
  const seen = new Set<string>()
  const categories: string[] = []
  for (const item of COST_ITEM_CATALOG) {
    if (!seen.has(item.category)) {
      seen.add(item.category)
      categories.push(item.category)
    }
  }
  return categories
}
