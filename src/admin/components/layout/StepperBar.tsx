import { useInspectionStore } from '../../stores/inspectionStore.ts'

const STEP_LABELS = [
  'Projekt',
  'Kulso',
  'Falak',
  'Nedvesseg',
  'Hokamera',
  'Nyilaszarok',
  'Elektromos',
  'Futes/Klima',
  'Lezermeresek',
  'Kockazat',
  'Koltseg',
] as const

interface StepperBarProps {
  /** Set of step indices that have been fully completed */
  completedSteps?: ReadonlySet<number>
}

export function StepperBar({ completedSteps }: StepperBarProps) {
  const currentStep = useInspectionStore((s) => s.currentStep)
  const setStep = useInspectionStore((s) => s.setStep)

  return (
    <nav
      className="overflow-x-auto border-b border-stone-700 bg-stone-800/95 backdrop-blur-sm"
      aria-label="Inspekcio lepesek"
    >
      <ol className="flex min-w-max items-center gap-1 px-2 py-2">
        {STEP_LABELS.map((label, index) => {
          const isCurrent = index === currentStep
          const isCompleted = completedSteps?.has(index) ?? false
          const canNavigate = index <= currentStep

          return (
            <li key={index} className="flex items-center">
              <button
                type="button"
                onClick={() => {
                  if (canNavigate) setStep(index)
                }}
                disabled={!canNavigate}
                className={`flex min-w-[2.75rem] flex-shrink-0 flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors touch-manipulation ${
                  isCurrent
                    ? 'bg-amber-600 text-white'
                    : isCompleted
                      ? 'bg-green-800/30 text-green-400 hover:bg-green-800/50'
                      : canNavigate
                        ? 'bg-stone-800 text-stone-400 hover:bg-stone-700 hover:text-stone-300'
                        : 'bg-stone-800 text-stone-500 cursor-default'
                }`}
                aria-current={isCurrent ? 'step' : undefined}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full text-[0.65rem] tabular-nums">
                  {isCompleted && !isCurrent ? (
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index
                  )}
                </span>
                <span className="hidden whitespace-nowrap lg:inline">{label}</span>
              </button>

              {/* Connector between steps */}
              {index < STEP_LABELS.length - 1 && (
                <div
                  className={`mx-0.5 h-px w-3 flex-shrink-0 ${
                    index < currentStep ? 'bg-amber-600/50' : 'bg-stone-700'
                  }`}
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
