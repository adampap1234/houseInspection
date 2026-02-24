import { FormStepWrapper } from './FormStepWrapper.tsx'
import { ChecklistField } from './ChecklistField.tsx'
import { exteriorSchema, type ExteriorForm } from '../../schemas/exterior.ts'
import type { ExteriorData } from '../../types/inspection.ts'

interface ExteriorStepProps {
  inspectionId: string
  defaultValues: ExteriorData
}

const CHECKLIST_ITEMS: { name: keyof ExteriorForm; label: string }[] = [
  { name: 'foundation', label: 'Alapozas' },
  { name: 'walls', label: 'Falak' },
  { name: 'roof', label: 'Teto' },
  { name: 'gutters', label: 'Ereszcsatorna' },
  { name: 'grading', label: 'Tereprendezes' },
]

export function ExteriorStep({ inspectionId, defaultValues }: ExteriorStepProps) {
  return (
    <FormStepWrapper<ExteriorForm>
      inspectionId={inspectionId}
      stepKey="exterior"
      schema={exteriorSchema}
      defaultValues={defaultValues}
    >
      {(form) => (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-stone-100">Kulso allapot</h2>
          <div className="space-y-3">
            {CHECKLIST_ITEMS.map((item) => (
              <ChecklistField<ExteriorForm>
                key={item.name}
                name={item.name}
                label={item.label}
                control={form.control}
              />
            ))}
          </div>
        </div>
      )}
    </FormStepWrapper>
  )
}
