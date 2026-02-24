import { z } from 'zod'

const checklistItemSchema = z.object({
  status: z.enum(['rendben', 'figyelendo', 'kockazatos']),
  notes: z.string(),
})

export const windowsDoorsSchema = z.object({
  condition: checklistItemSchema,
  seals: checklistItemSchema,
  glass: checklistItemSchema,
  hardware: checklistItemSchema,
  weatherStripping: checklistItemSchema,
})

export type WindowsDoorsForm = z.infer<typeof windowsDoorsSchema>
