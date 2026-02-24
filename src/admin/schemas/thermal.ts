import { z } from 'zod'

const checklistItemSchema = z.object({
  status: z.enum(['rendben', 'figyelendo', 'kockazatos']),
  notes: z.string(),
})

export const thermalSchema = z.object({
  exteriorTemp: z.coerce.number(),
  interiorTemp: z.coerce.number(),
  deltaT: z.coerce.number(),
  thermalBridges: checklistItemSchema,
  insulation: checklistItemSchema,
  windowSeals: checklistItemSchema,
})

export type ThermalForm = z.infer<typeof thermalSchema>
