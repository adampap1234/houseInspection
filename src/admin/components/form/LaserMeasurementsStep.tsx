import { useFieldArray } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
import { FormStepWrapper } from './FormStepWrapper.tsx'
import { laserSchema, type LaserForm } from '../../schemas/laser.ts'
import type { LaserData } from '../../types/inspection.ts'

interface LaserMeasurementsStepProps {
  inspectionId: string
  defaultValues: LaserData
}

const DIMENSION_OPTIONS = [
  { value: 'szelesseg', label: 'Szelesseg' },
  { value: 'magassag', label: 'Magassag' },
  { value: 'atlo', label: 'Atlo' },
  { value: 'egyeb', label: 'Egyeb' },
]

const UNIT_OPTIONS = [
  { value: 'mm', label: 'mm' },
  { value: 'cm', label: 'cm' },
  { value: 'm', label: 'm' },
]

export function LaserMeasurementsStep({
  inspectionId,
  defaultValues,
}: LaserMeasurementsStepProps) {
  return (
    <FormStepWrapper<LaserForm>
      inspectionId={inspectionId}
      stepKey="laser"
      schema={laserSchema}
      defaultValues={defaultValues}
    >
      {(form) => (
        <LaserMeasurementsContent form={form} />
      )}
    </FormStepWrapper>
  )
}

function LaserMeasurementsContent({
  form,
}: {
  form: ReturnType<typeof import('react-hook-form').useForm<LaserForm>>
}) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'measurements',
  })

  const handleAddMeasurement = () => {
    append({
      id: uuidv4(),
      location: '',
      dimension: '',
      value: 0,
      unit: 'cm',
      notes: '',
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-stone-100">
          Lezermeresek
        </h2>
        <button
          type="button"
          onClick={handleAddMeasurement}
          className="min-h-[44px] rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-500"
        >
          + Meres hozzaadasa
        </button>
      </div>

      {fields.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-700 bg-stone-800/50 p-8 text-center text-stone-500">
          <p>Meg nincsenek meresek.</p>
          <p className="mt-1 text-sm">
            Adjon hozza mereset a fenti gombbal.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="rounded-lg border border-stone-700 bg-stone-800/50 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-stone-400">
                  Meres #{index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-500 transition-colors hover:bg-red-900/30 hover:text-red-400"
                  aria-label={`Meres #${index + 1} torlese`}
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Measurement fields in a responsive grid */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {/* Location */}
                <div>
                  <label
                    htmlFor={`measurements.${index}.location`}
                    className="mb-1 block text-xs font-medium text-stone-400"
                  >
                    Helyszin
                  </label>
                  <input
                    {...form.register(`measurements.${index}.location`)}
                    id={`measurements.${index}.location`}
                    type="text"
                    placeholder="pl. Nappali fal"
                    className="min-h-[44px] w-full rounded-lg border border-stone-700 bg-stone-900/50 px-3 py-2 text-sm text-stone-200 placeholder:text-stone-600 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600"
                  />
                  {form.formState.errors.measurements?.[index]?.location && (
                    <p className="mt-1 text-xs text-red-400">
                      {form.formState.errors.measurements[index]?.location?.message}
                    </p>
                  )}
                </div>

                {/* Dimension */}
                <div>
                  <label
                    htmlFor={`measurements.${index}.dimension`}
                    className="mb-1 block text-xs font-medium text-stone-400"
                  >
                    Meresi irany
                  </label>
                  <select
                    {...form.register(`measurements.${index}.dimension`)}
                    id={`measurements.${index}.dimension`}
                    className="min-h-[44px] w-full rounded-lg border border-stone-700 bg-stone-900/50 px-3 py-2 text-sm text-stone-200 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600"
                  >
                    <option value="">Valasszon...</option>
                    {DIMENSION_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {form.formState.errors.measurements?.[index]?.dimension && (
                    <p className="mt-1 text-xs text-red-400">
                      {form.formState.errors.measurements[index]?.dimension?.message}
                    </p>
                  )}
                </div>

                {/* Value */}
                <div>
                  <label
                    htmlFor={`measurements.${index}.value`}
                    className="mb-1 block text-xs font-medium text-stone-400"
                  >
                    Ertek
                  </label>
                  <input
                    {...form.register(`measurements.${index}.value`, {
                      valueAsNumber: true,
                    })}
                    id={`measurements.${index}.value`}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0"
                    className="min-h-[44px] w-full rounded-lg border border-stone-700 bg-stone-900/50 px-3 py-2 text-sm text-stone-200 placeholder:text-stone-600 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600"
                  />
                  {form.formState.errors.measurements?.[index]?.value && (
                    <p className="mt-1 text-xs text-red-400">
                      {form.formState.errors.measurements[index]?.value?.message}
                    </p>
                  )}
                </div>

                {/* Unit */}
                <div>
                  <label
                    htmlFor={`measurements.${index}.unit`}
                    className="mb-1 block text-xs font-medium text-stone-400"
                  >
                    Egyseg
                  </label>
                  <select
                    {...form.register(`measurements.${index}.unit`)}
                    id={`measurements.${index}.unit`}
                    className="min-h-[44px] w-full rounded-lg border border-stone-700 bg-stone-900/50 px-3 py-2 text-sm text-stone-200 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600"
                  >
                    {UNIT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Notes */}
                <div className="sm:col-span-2 lg:col-span-2">
                  <label
                    htmlFor={`measurements.${index}.notes`}
                    className="mb-1 block text-xs font-medium text-stone-400"
                  >
                    Megjegyzes
                  </label>
                  <input
                    {...form.register(`measurements.${index}.notes`)}
                    id={`measurements.${index}.notes`}
                    type="text"
                    placeholder="Opcionalis megjegyzes..."
                    className="min-h-[44px] w-full rounded-lg border border-stone-700 bg-stone-900/50 px-3 py-2 text-sm text-stone-200 placeholder:text-stone-600 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {fields.length > 0 && (
        <div className="text-center">
          <button
            type="button"
            onClick={handleAddMeasurement}
            className="min-h-[44px] rounded-lg border border-stone-600 px-4 py-2 text-sm font-medium text-stone-400 transition-colors hover:border-stone-500 hover:bg-stone-800 hover:text-stone-300"
          >
            + Meres hozzaadasa
          </button>
        </div>
      )}
    </div>
  )
}
