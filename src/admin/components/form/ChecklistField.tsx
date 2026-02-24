import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form'
import type { RiskLevel } from '../../types/inspection.ts'

interface ChecklistFieldProps<T extends FieldValues> {
  name: Path<T>
  label: string
  control: Control<T>
}

const STATUS_OPTIONS: { value: RiskLevel; label: string; activeClass: string }[] = [
  {
    value: 'rendben',
    label: 'Rendben',
    activeClass: 'bg-green-600 text-white border-green-500',
  },
  {
    value: 'figyelendo',
    label: 'Figyelendo',
    activeClass: 'bg-yellow-600 text-white border-yellow-500',
  },
  {
    value: 'kockazatos',
    label: 'Kockazatos',
    activeClass: 'bg-red-600 text-white border-red-500',
  },
]

export function ChecklistField<T extends FieldValues>({
  name,
  label,
  control,
}: ChecklistFieldProps<T>) {
  // Derive the nested field paths from the parent name
  const statusPath = `${name}.status` as Path<T>
  const notesPath = `${name}.notes` as Path<T>

  return (
    <div className="rounded-lg border border-stone-700 bg-stone-800/50 p-4">
      <label className="mb-2 block text-sm font-medium text-stone-200">
        {label}
      </label>

      {/* Traffic light status selector */}
      <Controller
        name={statusPath}
        control={control}
        render={({ field }) => (
          <div className="mb-3 flex gap-2">
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => field.onChange(option.value)}
                className={`min-h-[44px] flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  field.value === option.value
                    ? option.activeClass
                    : 'border-stone-600 bg-stone-700/50 text-stone-400 hover:border-stone-500 hover:text-stone-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      />

      {/* Notes textarea */}
      <Controller
        name={notesPath}
        control={control}
        render={({ field }) => (
          <textarea
            {...field}
            value={(field.value as string) ?? ''}
            placeholder="Megjegyzesek..."
            rows={2}
            className="w-full resize-none rounded-lg border border-stone-700 bg-stone-900/50 px-3 py-2 text-sm text-stone-200 placeholder:text-stone-600 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600"
          />
        )}
      />
    </div>
  )
}
