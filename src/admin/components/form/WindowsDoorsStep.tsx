import { FormStepWrapper } from './FormStepWrapper.tsx'
import { ChecklistField } from './ChecklistField.tsx'
import { PhotoGallery } from '../photo/PhotoGallery.tsx'
import { windowsDoorsSchema, type WindowsDoorsForm } from '../../schemas/windows-doors.ts'
import type { WindowsDoorsData } from '../../types/inspection.ts'

interface WindowsDoorsStepProps {
  inspectionId: string
  defaultValues: WindowsDoorsData
}

const CHECKLIST_ITEMS: { name: keyof WindowsDoorsForm; label: string }[] = [
  { name: 'condition', label: 'Allapot' },
  { name: 'seals', label: 'Tomitesek' },
  { name: 'glass', label: 'Uvegezes' },
  { name: 'hardware', label: 'Vasalat' },
  { name: 'weatherStripping', label: 'Szigeteloszalag' },
]

export function WindowsDoorsStep({ inspectionId, defaultValues }: WindowsDoorsStepProps) {
  return (
    <FormStepWrapper<WindowsDoorsForm>
      inspectionId={inspectionId}
      stepKey="windowsDoors"
      schema={windowsDoorsSchema}
      defaultValues={defaultValues}
    >
      {(form) => (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-stone-100">
            Nyilaszarok
          </h2>
          <div className="space-y-3">
            {CHECKLIST_ITEMS.map((item) => (
              <ChecklistField<WindowsDoorsForm>
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
            <PhotoGallery inspectionId={inspectionId} stepKey="windowsDoors" />
          </div>
        </div>
      )}
    </FormStepWrapper>
  )
}
