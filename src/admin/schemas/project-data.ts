import { z } from 'zod'

export const projectDataSchema = z.object({
  clientName: z.string().min(1, 'Ugyfél neve kotelezo'),
  address: z.string().min(1, 'Cim megadasa kotelezo'),
  inspectorName: z.string().min(1, 'Ellenor neve kotelezo'),
  date: z.string().min(1, 'Datum megadasa kotelezo'),
  projectType: z.string(),
  notes: z.string(),
})

export type ProjectDataForm = z.infer<typeof projectDataSchema>
