import { FormStepWrapper } from './FormStepWrapper.tsx'
import { ChecklistField } from './ChecklistField.tsx'
import { PhotoGallery } from '../photo/PhotoGallery.tsx'
import { wallStructureSchema, type WallStructureForm } from '../../schemas/wall-structure.ts'
import type { WallStructureData } from '../../types/inspection.ts'

interface WallStructureStepProps {
  inspectionId: string
  defaultValues: WallStructureData
}

const CHECKLIST_ITEMS: { name: keyof WallStructureForm; label: string }[] = [
  { name: 'loadBearing', label: 'Teherhordo szerkezet' },
  { name: 'cracks', label: 'Repedesek' },
  { name: 'insulation', label: 'Szigeteles' },
  { name: 'dampProofing', label: 'Vizszigeteles' },
]

export function WallStructureStep({ inspectionId, defaultValues }: WallStructureStepProps) {
  return (
    <FormStepWrapper<WallStructureForm>
      inspectionId={inspectionId}
      stepKey="wallStructure"
      schema={wallStructureSchema}
      defaultValues={defaultValues}
    >
      {(form) => (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-stone-100">Fal / szerkezet</h2>
          <div className="space-y-3">
            {CHECKLIST_ITEMS.map((item) => (
              <ChecklistField<WallStructureForm>
                key={item.name}
                name={item.name}
                label={item.label}
                control={form.control}
              />
            ))}
          </div>

          {/* Photo gallery */}
          <div className="space-y-2 border-t border-stone-700 pt-4">
            <h3 className="text-sm font-medium text-stone-300">Fenykepek</h3>
            <PhotoGallery inspectionId={inspectionId} stepKey="wallStructure" />
          </div>
        </div>
      )}
    </FormStepWrapper>
  )
}
