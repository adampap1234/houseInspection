import { z } from 'zod'

const checklistItemSchema = z.object({
  status: z.enum(['rendben', 'figyelendo', 'kockazatos']),
  notes: z.string(),
})

export const electricalSchema = z.object({
  panel: checklistItemSchema,
  wiring: checklistItemSchema,
  outlets: checklistItemSchema,
  grounding: checklistItemSchema,
  gfci: checklistItemSchema,
})

export type ElectricalForm = z.infer<typeof electricalSchema>
