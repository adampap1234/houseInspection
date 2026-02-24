import { FormStepWrapper } from './FormStepWrapper.tsx'
import { ChecklistField } from './ChecklistField.tsx'
import { PhotoGallery } from '../photo/PhotoGallery.tsx'
import { electricalSchema, type ElectricalForm } from '../../schemas/electrical.ts'
import type { ElectricalData } from '../../types/inspection.ts'

interface ElectricalStepProps {
  inspectionId: string
  defaultValues: ElectricalData
}

const CHECKLIST_ITEMS: { name: keyof ElectricalForm; label: string }[] = [
  { name: 'panel', label: 'Eloszto tabla' },
  { name: 'wiring', label: 'Vezetekezese' },
  { name: 'outlets', label: 'Konnektor csatlakozok' },
  { name: 'grounding', label: 'Foldeles' },
  { name: 'gfci', label: 'FI-rele' },
]

export function ElectricalStep({ inspectionId, defaultValues }: ElectricalStepProps) {
  return (
    <FormStepWrapper<ElectricalForm>
      inspectionId={inspectionId}
      stepKey="electrical"
      schema={electricalSchema}
      defaultValues={defaultValues}
    >
      {(form) => (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-stone-100">
            Elektromos rendszer
          </h2>
          <div className="space-y-3">
            {CHECKLIST_ITEMS.map((item) => (
              <ChecklistField<ElectricalForm>
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
            <PhotoGallery inspectionId={inspectionId} stepKey="electrical" />
          </div>
        </div>
      )}
    </FormStepWrapper>
  )
}
