import { FormStepWrapper } from './FormStepWrapper.tsx'
import { projectDataSchema, type ProjectDataForm } from '../../schemas/project-data.ts'
import type { ProjectData } from '../../types/inspection.ts'

interface ProjectDataStepProps {
  inspectionId: string
  defaultValues: ProjectData
}

const PROJECT_TYPES = [
  { value: '', label: 'Valasszon...' },
  { value: 'lakas', label: 'Lakas' },
  { value: 'haz', label: 'Csaladi haz' },
  { value: 'tarsashaz', label: 'Tarsashaz' },
  { value: 'iroda', label: 'Iroda' },
  { value: 'ipari', label: 'Ipari epulet' },
  { value: 'egyeb', label: 'Egyeb' },
]

export function ProjectDataStep({ inspectionId, defaultValues }: ProjectDataStepProps) {
  return (
    <FormStepWrapper<ProjectDataForm>
      inspectionId={inspectionId}
      stepKey="projectData"
      schema={projectDataSchema}
      defaultValues={defaultValues}
    >
      {(form) => (
        <div className="space-y-5">
          <h2 className="text-xl font-semibold text-stone-100">Projekt adatok</h2>

          {/* Client name */}
          <div>
            <label htmlFor="clientName" className="mb-1 block text-sm font-medium text-stone-300">
              Ugyfel neve *
            </label>
            <input
              id="clientName"
              type="text"
              {...form.register('clientName')}
              className="min-h-[44px] w-full rounded-lg border border-stone-700 bg-stone-900/50 px-3 py-2.5 text-stone-200 placeholder:text-stone-600 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600"
              placeholder="Pl. Kovacs Janos"
            />
            {form.formState.errors.clientName && (
              <p className="mt-1 text-sm text-red-400">{form.formState.errors.clientName.message}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="mb-1 block text-sm font-medium text-stone-300">
              Cim *
            </label>
            <input
              id="address"
              type="text"
              {...form.register('address')}
              className="min-h-[44px] w-full rounded-lg border border-stone-700 bg-stone-900/50 px-3 py-2.5 text-stone-200 placeholder:text-stone-600 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600"
              placeholder="Pl. 1012 Budapest, Fo utca 1."
            />
            {form.formState.errors.address && (
              <p className="mt-1 text-sm text-red-400">{form.formState.errors.address.message}</p>
            )}
          </div>

          {/* Inspector name */}
          <div>
            <label htmlFor="inspectorName" className="mb-1 block text-sm font-medium text-stone-300">
              Ellenor neve *
            </label>
            <input
              id="inspectorName"
              type="text"
              {...form.register('inspectorName')}
              className="min-h-[44px] w-full rounded-lg border border-stone-700 bg-stone-900/50 px-3 py-2.5 text-stone-200 placeholder:text-stone-600 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600"
              placeholder="Pl. Nagy Peter"
            />
            {form.formState.errors.inspectorName && (
              <p className="mt-1 text-sm text-red-400">{form.formState.errors.inspectorName.message}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="mb-1 block text-sm font-medium text-stone-300">
              Datum *
            </label>
            <input
              id="date"
              type="date"
              {...form.register('date')}
              className="min-h-[44px] w-full rounded-lg border border-stone-700 bg-stone-900/50 px-3 py-2.5 text-stone-200 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600"
            />
            {form.formState.errors.date && (
              <p className="mt-1 text-sm text-red-400">{form.formState.errors.date.message}</p>
            )}
          </div>

          {/* Project type */}
          <div>
            <label htmlFor="projectType" className="mb-1 block text-sm font-medium text-stone-300">
              Projekt tipusa
            </label>
            <select
              id="projectType"
              {...form.register('projectType')}
              className="min-h-[44px] w-full rounded-lg border border-stone-700 bg-stone-900/50 px-3 py-2.5 text-stone-200 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600"
            >
              {PROJECT_TYPES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="mb-1 block text-sm font-medium text-stone-300">
              Megjegyzesek
            </label>
            <textarea
              id="notes"
              {...form.register('notes')}
              rows={3}
              className="w-full resize-none rounded-lg border border-stone-700 bg-stone-900/50 px-3 py-2.5 text-stone-200 placeholder:text-stone-600 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600"
              placeholder="Egyeb megjegyzesek..."
            />
          </div>
        </div>
      )}
    </FormStepWrapper>
  )
}
