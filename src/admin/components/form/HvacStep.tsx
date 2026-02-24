import { FormStepWrapper } from './FormStepWrapper.tsx'
import { ChecklistField } from './ChecklistField.tsx'
import { hvacSchema, type HvacForm } from '../../schemas/hvac.ts'
import type { HvacData } from '../../types/inspection.ts'

interface HvacStepProps {
  inspectionId: string
  defaultValues: HvacData
}

const CHECKLIST_ITEMS: { name: keyof HvacForm; label: string }[] = [
  { name: 'heating', label: 'Futes' },
  { name: 'cooling', label: 'Hutes' },
  { name: 'ventilation', label: 'Szellozes' },
  { name: 'ductwork', label: 'Legcsatorna' },
  { name: 'thermostat', label: 'Termosztat' },
]

export function HvacStep({ inspectionId, defaultValues }: HvacStepProps) {
  return (
    <FormStepWrapper<HvacForm>
      inspectionId={inspectionId}
      stepKey="hvac"
      schema={hvacSchema}
      defaultValues={defaultValues}
    >
      {(form) => (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-stone-100">
            Futes / Klima / Szellozes
          </h2>
          <div className="space-y-3">
            {CHECKLIST_ITEMS.map((item) => (
              <ChecklistField<HvacForm>
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
