import { z } from 'zod'

const riskScoreSchema = z.object({
  id: z.string(),
  category: z.string(),
  level: z.enum(['rendben', 'figyelendo', 'kockazatos']),
  autoCalculated: z.boolean(),
  manuallyAdjusted: z.boolean(),
  reason: z.string(),
})

export const riskAssessmentSchema = z.object({
  risks: z.array(riskScoreSchema),
})

export type RiskAssessmentForm = z.infer<typeof riskAssessmentSchema>
