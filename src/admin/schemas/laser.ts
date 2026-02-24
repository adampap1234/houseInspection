import { z } from 'zod'

export const measurementSchema = z.object({
  id: z.string(),
  location: z.string().min(1, 'Helyszin megadasa kotelezo'),
  dimension: z.string().min(1, 'Meresi irany megadasa kotelezo'),
  value: z.number().positive('Az erteknek pozitivnak kell lennie'),
  unit: z.enum(['mm', 'cm', 'm']),
  notes: z.string(),
})

export const laserSchema = z.object({
  measurements: z.array(measurementSchema),
})

export type LaserForm = z.infer<typeof laserSchema>
export type MeasurementForm = z.infer<typeof measurementSchema>
