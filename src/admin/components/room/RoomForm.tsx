import { Controller, type Control, type UseFormRegister } from 'react-hook-form'
import type { MoistureForm } from '../../schemas/moisture.ts'

interface RoomFormProps {
  index: number
  control: Control<MoistureForm>
  register: UseFormRegister<MoistureForm>
}

const WALL_TYPE_OPTIONS = [
  { value: 'exterior', label: 'Kulso fal' },
  { value: 'interior', label: 'Belso fal' },
] as const

const MOLD_OPTIONS = [
  { value: 'none', label: 'Nincs' },
  { value: 'suspected', label: 'Gyanus' },
  { value: 'visible', label: 'Lathato' },
] as const

export function RoomForm({ index, control, register }: RoomFormProps) {
  const prefix = `rooms.${index}` as const

  return (
    <div className="space-y-4">
      {/* Row 1: Room name + Wall type */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-300">
            Szoba neve
          </label>
          <input
            type="text"
            {...register(`${prefix}.roomName`)}
            placeholder="pl. Nappali, Haloszoba"
            className="w-full rounded-lg border border-stone-600 bg-stone-700 px-3 py-2.5 text-sm text-stone-100 placeholder:text-stone-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-300">
            Fal tipusa
          </label>
          <select
            {...register(`${prefix}.wallType`)}
            className="w-full rounded-lg border border-stone-600 bg-stone-700 px-3 py-2.5 text-sm text-stone-100 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            {WALL_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 2: Moisture %, Humidity %, Temperature */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-300">
            Nedvesseg %
          </label>
          <input
            type="number"
            min={0}
            max={100}
            step="0.1"
            {...register(`${prefix}.moisturePercent`, { valueAsNumber: true })}
            placeholder="0-100"
            className="w-full rounded-lg border border-stone-600 bg-stone-700 px-3 py-2.5 text-sm text-stone-100 placeholder:text-stone-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-300">
            Relativ paratartalom %
          </label>
          <input
            type="number"
            min={0}
            max={100}
            step="0.1"
            {...register(`${prefix}.relativeHumidity`, { valueAsNumber: true })}
            placeholder="0-100"
            className="w-full rounded-lg border border-stone-600 bg-stone-700 px-3 py-2.5 text-sm text-stone-100 placeholder:text-stone-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-300">
            Homerseklet &deg;C
          </label>
          <input
            type="number"
            step="0.1"
            {...register(`${prefix}.temperature`, { valueAsNumber: true })}
            placeholder="pl. 22.5"
            className="w-full rounded-lg border border-stone-600 bg-stone-700 px-3 py-2.5 text-sm text-stone-100 placeholder:text-stone-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Row 3: Mold signs + Musty smell */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Mold signs - radio buttons */}
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-300">
            Penesz jelei
          </label>
          <Controller
            name={`${prefix}.moldSigns`}
            control={control}
            render={({ field }) => (
              <div className="flex gap-2">
                {MOLD_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => field.onChange(opt.value)}
                    className={`min-h-[44px] flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      field.value === opt.value
                        ? opt.value === 'none'
                          ? 'border-green-500 bg-green-600 text-white'
                          : opt.value === 'suspected'
                            ? 'border-yellow-500 bg-yellow-600 text-white'
                            : 'border-red-500 bg-red-600 text-white'
                        : 'border-stone-600 bg-stone-700/50 text-stone-400 hover:border-stone-500 hover:text-stone-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          />
        </div>

        {/* Musty smell - toggle */}
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-300">
            Dohos szag
          </label>
          <Controller
            name={`${prefix}.mustySmell`}
            control={control}
            render={({ field }) => (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => field.onChange(false)}
                  className={`min-h-[44px] flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    !field.value
                      ? 'border-green-500 bg-green-600 text-white'
                      : 'border-stone-600 bg-stone-700/50 text-stone-400 hover:border-stone-500 hover:text-stone-300'
                  }`}
                >
                  Nem
                </button>
                <button
                  type="button"
                  onClick={() => field.onChange(true)}
                  className={`min-h-[44px] flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    field.value
                      ? 'border-red-500 bg-red-600 text-white'
                      : 'border-stone-600 bg-stone-700/50 text-stone-400 hover:border-stone-500 hover:text-stone-300'
                  }`}
                >
                  Igen
                </button>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  )
}
