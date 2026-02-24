import { useState, useCallback } from 'react'
import { useFieldArray } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
import { FormStepWrapper } from './FormStepWrapper.tsx'
import { RoomAccordion } from '../room/RoomAccordion.tsx'
import { RoomForm } from '../room/RoomForm.tsx'
import { PhotoGallery } from '../photo/PhotoGallery.tsx'
import { moistureSchema, type MoistureForm } from '../../schemas/moisture.ts'
import type { MoistureData } from '../../types/inspection.ts'

interface MoistureStepProps {
  inspectionId: string
  defaultValues: MoistureData
}

const DEFAULT_ROOM = () => ({
  id: uuidv4(),
  roomName: '',
  wallType: 'exterior' as const,
  moisturePercent: 0,
  relativeHumidity: 0,
  temperature: 0,
  moldSigns: 'none' as const,
  mustySmell: false,
})

export function MoistureStep({ inspectionId, defaultValues }: MoistureStepProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <FormStepWrapper<MoistureForm>
      inspectionId={inspectionId}
      stepKey="moisture"
      schema={moistureSchema}
      defaultValues={defaultValues}
    >
      {(form) => (
        <MoistureStepInner
          form={form}
          inspectionId={inspectionId}
          expandedId={expandedId}
          setExpandedId={setExpandedId}
        />
      )}
    </FormStepWrapper>
  )
}

interface MoistureStepInnerProps {
  form: ReturnType<typeof import('react-hook-form').useForm<MoistureForm>>
  inspectionId: string
  expandedId: string | null
  setExpandedId: (id: string | null) => void
}

function MoistureStepInner({ form, inspectionId, expandedId, setExpandedId }: MoistureStepInnerProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'rooms',
  })

  const handleAddRoom = () => {
    const newRoom = DEFAULT_ROOM()
    append(newRoom)
    setExpandedId(newRoom.id)
  }

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const handleDelete = (id: string) => {
    const index = fields.findIndex((f) => f.id === id)
    if (index !== -1) {
      remove(index)
      if (expandedId === id) {
        setExpandedId(null)
      }
    }
  }

  const isComplete = useCallback(
    (id: string) => {
      const index = fields.findIndex((f) => f.id === id)
      if (index === -1) return false

      const room = form.getValues(`rooms.${index}`)
      if (!room) return false

      return (
        room.roomName.trim().length > 0 &&
        typeof room.moisturePercent === 'number' &&
        typeof room.relativeHumidity === 'number' &&
        typeof room.temperature === 'number'
      )
    },
    [fields, form]
  )

  const rooms = fields.map((field, index) => ({
    id: field.id,
    name: form.watch(`rooms.${index}.roomName`) || '',
  }))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-stone-100">
          Nedvesseg / Penesz
        </h2>
        <button
          type="button"
          onClick={handleAddRoom}
          className="min-h-[44px] rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-500"
        >
          + Szoba hozzaadasa
        </button>
      </div>

      {form.formState.errors.rooms?.root?.message && (
        <p className="text-sm text-red-400">
          {form.formState.errors.rooms.root.message}
        </p>
      )}

      <RoomAccordion
        rooms={rooms}
        expandedId={expandedId}
        onToggle={handleToggle}
        onDelete={handleDelete}
        isComplete={isComplete}
        renderContent={(roomId, index) => (
          <div className="space-y-4">
            <RoomForm
              index={index}
              control={form.control}
              register={form.register}
            />
            <div className="space-y-2 border-t border-stone-700 pt-4">
              <h4 className="text-sm font-medium text-stone-300">Fenykepek</h4>
              <PhotoGallery
                inspectionId={inspectionId}
                stepKey="moisture"
                roomId={roomId}
              />
            </div>
          </div>
        )}
      />
    </div>
  )
}
