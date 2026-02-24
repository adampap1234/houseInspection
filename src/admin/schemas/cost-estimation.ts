import { z } from 'zod'

const costItemSchema = z.object({
  id: z.string(),
  category: z.string(),
  description: z.string(),
  selected: z.boolean(),
  minCostHuf: z.number(),
  maxCostHuf: z.number(),
})

export const costEstimationSchema = z.object({
  costItems: z.array(costItemSchema),
})

export type CostEstimationForm = z.infer<typeof costEstimationSchema>
