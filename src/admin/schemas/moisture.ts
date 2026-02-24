import { z } from 'zod'

export const roomMoistureSchema = z.object({
  id: z.string(),
  roomName: z.string().min(1, 'A szoba neve kotelozo'),
  wallType: z.enum(['exterior', 'interior']),
  moisturePercent: z.coerce.number().min(0).max(100),
  relativeHumidity: z.coerce.number().min(0).max(100),
  temperature: z.coerce.number(),
  moldSigns: z.enum(['none', 'suspected', 'visible']),
  mustySmell: z.boolean(),
})

export const moistureSchema = z.object({
  rooms: z
    .array(roomMoistureSchema)
    .min(1, 'Legalabb egy szoba szukseges'),
})

export type RoomMoistureForm = z.infer<typeof roomMoistureSchema>
export type MoistureForm = z.infer<typeof moistureSchema>
