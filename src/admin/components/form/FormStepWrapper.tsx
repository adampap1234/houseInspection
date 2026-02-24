import { type ReactNode, useEffect } from 'react'
import {
  useForm,
  type DefaultValues,
  type FieldValues,
  type UseFormReturn,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAutoSave } from '../../hooks/useAutoSave.ts'
import { StepNavigation } from '../layout/StepNavigation.tsx'
import { useInspectionStore } from '../../stores/inspectionStore.ts'
import { db } from '../../lib/db.ts'
import type { Inspection } from '../../types/inspection.ts'

interface FormStepWrapperProps<T extends FieldValues> {
  inspectionId: string
  stepKey: keyof Inspection
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: any
  defaultValues: DefaultValues<T>
  children: (form: UseFormReturn<T>) => ReactNode
}

const TOTAL_STEPS = 11

export function FormStepWrapper<T extends FieldValues>({
  inspectionId,
  stepKey,
  schema,
  defaultValues,
  children,
}: FormStepWrapperProps<T>) {
  const currentStep = useInspectionStore((s) => s.currentStep)
  const setStep = useInspectionStore((s) => s.setStep)

  const form = useForm<T>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues,
    mode: 'onChange',
  })

  const { reset } = form

  // Reset form only when switching to a different inspection — NOT on auto-save.
  // useLiveQuery produces a new object reference every time Dexie writes,
  // which would reset the form (and collapse accordions, lose focus, etc.).
  useEffect(() => {
    reset(defaultValues)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inspectionId])

  // Auto-save integration
  useAutoSave(inspectionId, stepKey, form.watch)

  const handleNext = async () => {
    const valid = await form.trigger()
    if (valid) {
      const nextStep = currentStep + 1
      // Persist currentStep to Dexie so browser close/reopen resumes here
      await db.inspections.update(inspectionId, { currentStep: nextStep })
      setStep(nextStep)
    }
  }

  const handlePrevious = async () => {
    const prevStep = currentStep - 1
    await db.inspections.update(inspectionId, { currentStep: prevStep })
    setStep(prevStep)
  }

  return (
    <div className="space-y-6">
      {children(form)}
      <StepNavigation
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </div>
  )
}
