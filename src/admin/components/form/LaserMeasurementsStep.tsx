import type { LaserData } from '../../types/inspection.ts'

interface LaserMeasurementsStepProps {
  inspectionId: string
  defaultValues: LaserData
}

// Placeholder -- full implementation in Task 2
export function LaserMeasurementsStep({ inspectionId: _inspectionId, defaultValues: _defaultValues }: LaserMeasurementsStepProps) {
  return (
    <div className="rounded-xl border border-stone-700 bg-stone-800 p-8 text-center text-stone-400">
      <p className="text-lg font-medium">Lezermeresek</p>
      <p className="mt-1 text-sm">Hamarosan elerheto</p>
    </div>
  )
}
