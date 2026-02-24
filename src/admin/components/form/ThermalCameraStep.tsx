import { useEffect } from 'react'
import { FormStepWrapper } from './FormStepWrapper.tsx'
import { ChecklistField } from './ChecklistField.tsx'
import { thermalSchema, type ThermalForm } from '../../schemas/thermal.ts'
import type { ThermalData } from '../../types/inspection.ts'

interface ThermalCameraStepProps {
  inspectionId: string
  defaultValues: ThermalData
}

const CHECKLIST_ITEMS: { name: keyof ThermalForm; label: string }[] = [
  { name: 'thermalBridges', label: 'Hohidak' },
  { name: 'insulation', label: 'Szigeteles' },
  { name: 'windowSeals', label: 'Ablaktomites' },
]

function getDeltaTColor(deltaT: number): string {
  if (deltaT < 3) return 'text-green-400 border-green-600 bg-green-600/10'
  if (deltaT <= 5) return 'text-yellow-400 border-yellow-600 bg-yellow-600/10'
  return 'text-red-400 border-red-600 bg-red-600/10'
}

function getDeltaTLabel(deltaT: number): string {
  if (deltaT < 3) return 'Megfelelo'
  if (deltaT <= 5) return 'Figyelendo'
  return 'Jelentos elteres'
}

export function ThermalCameraStep({ inspectionId, defaultValues }: ThermalCameraStepProps) {
  return (
    <FormStepWrapper<ThermalForm>
      inspectionId={inspectionId}
      stepKey="thermal"
      schema={thermalSchema}
      defaultValues={defaultValues}
    >
      {(form) => <ThermalCameraStepInner form={form} />}
    </FormStepWrapper>
  )
}

interface ThermalCameraStepInnerProps {
  form: ReturnType<typeof import('react-hook-form').useForm<ThermalForm>>
}

function ThermalCameraStepInner({ form }: ThermalCameraStepInnerProps) {
  const exteriorTemp = form.watch('exteriorTemp')
  const interiorTemp = form.watch('interiorTemp')

  // Auto-calculate deltaT when temperatures change
  useEffect(() => {
    const ext = Number(exteriorTemp) || 0
    const int = Number(interiorTemp) || 0
    const delta = Math.abs(int - ext)
    const rounded = Math.round(delta * 10) / 10
    form.setValue('deltaT', rounded, { shouldDirty: true })
  }, [exteriorTemp, interiorTemp, form])

  const deltaT = form.watch('deltaT') || 0
  const colorClass = getDeltaTColor(deltaT)
  const label = getDeltaTLabel(deltaT)

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-stone-100">
        Hokamera vizsgalat
      </h2>

      {/* Temperature inputs */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-300">
            Kulso homerseklet
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              {...form.register('exteriorTemp', { valueAsNumber: true })}
              placeholder="pl. 5"
              className="w-full rounded-lg border border-stone-600 bg-stone-700 px-3 py-2.5 pr-10 text-sm text-stone-100 placeholder:text-stone-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-stone-500">
              &deg;C
            </span>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-300">
            Belso homerseklet
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              {...form.register('interiorTemp', { valueAsNumber: true })}
              placeholder="pl. 22"
              className="w-full rounded-lg border border-stone-600 bg-stone-700 px-3 py-2.5 pr-10 text-sm text-stone-100 placeholder:text-stone-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-stone-500">
              &deg;C
            </span>
          </div>
        </div>
      </div>

      {/* Delta-T display */}
      <div className={`rounded-xl border-2 p-4 text-center ${colorClass}`}>
        <p className="text-xs font-medium uppercase tracking-wider opacity-70">
          Homerseklet-kulonbseg
        </p>
        <p className="mt-1 text-3xl font-bold tabular-nums">
          {deltaT.toFixed(1)}&deg;C
        </p>
        <p className="mt-1 text-sm font-medium">
          {label}
        </p>
      </div>

      {/* Checklist fields */}
      <div className="space-y-3">
        {CHECKLIST_ITEMS.map((item) => (
          <ChecklistField<ThermalForm>
            key={item.name}
            name={item.name}
            label={item.label}
            control={form.control}
          />
        ))}
      </div>

      {/* Note about photo attachment */}
      <div className="rounded-lg border border-stone-700 bg-stone-800/30 px-4 py-3">
        <p className="text-xs text-stone-500">
          Hokamera kepek csatolasa a foto kezeles lepesben lesz elerheto.
        </p>
      </div>
    </div>
  )
}
