interface StepNavigationProps {
  currentStep: number
  totalSteps: number
  onPrevious: () => void
  onNext: () => void
}

export function StepNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
}: StepNavigationProps) {
  const isFirst = currentStep === 0
  const isLast = currentStep === totalSteps - 1

  return (
    <div className="flex items-center justify-between border-t border-stone-700 pt-4">
      <button
        type="button"
        onClick={onPrevious}
        disabled={isFirst}
        className="min-h-[44px] rounded-lg border border-stone-600 px-5 py-2.5 text-sm font-medium text-stone-300 transition-colors hover:border-stone-500 hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Elozo
      </button>
      <span className="text-xs text-stone-500">
        {currentStep + 1} / {totalSteps}
      </span>
      <button
        type="button"
        onClick={onNext}
        className="min-h-[44px] rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-500"
      >
        {isLast ? 'Osszegzes' : 'Kovetkezo'}
      </button>
    </div>
  )
}
