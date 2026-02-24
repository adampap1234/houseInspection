import { z } from 'zod'

const checklistItemSchema = z.object({
  status: z.enum(['rendben', 'figyelendo', 'kockazatos']),
  notes: z.string(),
})

export const wallStructureSchema = z.object({
  loadBearing: checklistItemSchema,
  cracks: checklistItemSchema,
  insulation: checklistItemSchema,
  dampProofing: checklistItemSchema,
})

export type WallStructureForm = z.infer<typeof wallStructureSchema>
