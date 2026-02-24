import { z } from 'zod'

const checklistItemSchema = z.object({
  status: z.enum(['rendben', 'figyelendo', 'kockazatos']),
  notes: z.string(),
})

export const hvacSchema = z.object({
  heating: checklistItemSchema,
  cooling: checklistItemSchema,
  ventilation: checklistItemSchema,
  ductwork: checklistItemSchema,
  thermostat: checklistItemSchema,
})

export type HvacForm = z.infer<typeof hvacSchema>
