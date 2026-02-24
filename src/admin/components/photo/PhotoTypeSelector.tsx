import { useState } from 'react'

const PHOTO_TYPES = [
  { value: 'visible', label: 'Latható', color: 'bg-blue-500' },
  { value: 'thermal', label: 'Hőkamera', color: 'bg-red-500' },
  { value: 'other', label: 'Egyéb', color: 'bg-gray-500' },
] as const

type PhotoType = 'visible' | 'thermal' | 'other'

interface PhotoTypeSelectorProps {
  value?: PhotoType
  onChange: (type: PhotoType) => void
}

export function PhotoTypeSelector({
  value = 'visible',
  onChange,
}: PhotoTypeSelectorProps) {
  const [selected, setSelected] = useState<PhotoType>(value)

  const handleSelect = (type: PhotoType) => {
    setSelected(type)
    onChange(type)
  }

  return (
    <div className="flex gap-1">
      {PHOTO_TYPES.map((type) => (
        <button
          key={type.value}
          type="button"
          onClick={() => handleSelect(type.value)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            selected === type.value
              ? `${type.color} text-white`
              : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
          }`}
        >
          {type.label}
        </button>
      ))}
    </div>
  )
}
