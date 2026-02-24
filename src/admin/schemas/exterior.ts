import { z } from 'zod'

const checklistItemSchema = z.object({
  status: z.enum(['rendben', 'figyelendo', 'kockazatos']),
  notes: z.string(),
})

export const exteriorSchema = z.object({
  foundation: checklistItemSchema,
  walls: checklistItemSchema,
  roof: checklistItemSchema,
  gutters: checklistItemSchema,
  grading: checklistItemSchema,
})

export type ExteriorForm = z.infer<typeof exteriorSchema>
