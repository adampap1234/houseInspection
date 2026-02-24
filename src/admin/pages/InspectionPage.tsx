import { useParams, Navigate } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect } from 'react'
import { AdminLayout } from '../components/layout/AdminLayout.tsx'
import { StepperBar } from '../components/layout/StepperBar.tsx'
import { db } from '../lib/db.ts'
import { useInspectionStore } from '../stores/inspectionStore.ts'
import { MoistureStep } from '../components/form/MoistureStep.tsx'
import { ElectricalStep } from '../components/form/ElectricalStep.tsx'
import { HvacStep } from '../components/form/HvacStep.tsx'
import { LaserMeasurementsStep } from '../components/form/LaserMeasurementsStep.tsx'
import type { Inspection } from '../types/inspection.ts'

function StepPlaceholder({ name }: { name: string }) {
  return (
    <div className="rounded-xl border border-stone-700 bg-stone-800 p-8 text-center text-stone-400">
      <p className="text-lg font-medium">{name}</p>
      <p className="mt-1 text-sm">Hamarosan elerheto</p>
    </div>
  )
}

function renderStep(step: number, inspection: Inspection) {
  const id = inspection.id

  switch (step) {
    case 0:
      return <StepPlaceholder name="Projekt adatok" />
    case 1:
      return <StepPlaceholder name="Kulso allapot" />
    case 2:
      return <StepPlaceholder name="Fal/szerkezet" />
    case 3:
      return <MoistureStep inspectionId={id} defaultValues={inspection.moisture} />
    case 4:
      return <StepPlaceholder name="Hokamera vizsgalat" />
    case 5:
      return <StepPlaceholder name="Nyilaszarok" />
    case 6:
      return <ElectricalStep inspectionId={id} defaultValues={inspection.electrical} />
    case 7:
      return <HvacStep inspectionId={id} defaultValues={inspection.hvac} />
    case 8:
      return <LaserMeasurementsStep inspectionId={id} defaultValues={inspection.laser} />
    case 9:
      return <StepPlaceholder name="Kockazat ertekeles" />
    case 10:
      return <StepPlaceholder name="Koltsegbecsles" />
    default:
      return <StepPlaceholder name="Ismeretlen lepes" />
  }
}

export function InspectionPage() {
  const { id } = useParams<{ id: string }>()
  const currentStep = useInspectionStore((s) => s.currentStep)
  const setStep = useInspectionStore((s) => s.setStep)
  const setInspectionId = useInspectionStore((s) => s.setInspectionId)

  const inspection = useLiveQuery(
    () => (id ? db.inspections.get(id) : undefined),
    [id]
  )

  // Sync inspection ID on mount, clear on unmount
  useEffect(() => {
    if (id) {
      setInspectionId(id)
    }
    return () => { setInspectionId(null) }
  }, [id, setInspectionId])

  // Restore step from Dexie once inspection loads
  useEffect(() => {
    if (inspection && inspection.currentStep !== currentStep) {
      setStep(inspection.currentStep)
    }
    // Only run on initial load, not on every step change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inspection?.id])

  if (!id) {
    return <Navigate to="/admin/dashboard" replace />
  }

  if (inspection === undefined) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12 text-stone-400">
          <p>Betoltese...</p>
        </div>
      </AdminLayout>
    )
  }

  if (inspection === null) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-12 text-stone-400">
          <p className="text-lg">Inspekcio nem talalhato</p>
          <p className="mt-1 text-sm">A keresett inspekcio nem letezik.</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-4">
        <StepperBar />
        {renderStep(currentStep, inspection)}
      </div>
    </AdminLayout>
  )
}
