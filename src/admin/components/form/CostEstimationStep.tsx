import { useState, useCallback, useEffect } from 'react'
import { db } from '../../lib/db.ts'
import { getDefaultCostItems, getCostCategories } from '../../data/cost-items.ts'
import { useInspectionStore } from '../../stores/inspectionStore.ts'
import { StepNavigation } from '../layout/StepNavigation.tsx'
import type { CostItem } from '../../types/inspection.ts'

interface CostEstimationStepProps {
  inspectionId: string
  defaultValues: CostItem[]
}

const TOTAL_STEPS = 11

/**
 * Format a number in Hungarian style with space as thousands separator.
 * Example: 1500000 => "1 500 000"
 */
function formatHuf(value: number): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

/**
 * Format a cost range as "300 - 800 ezer Ft" or "1 500 - 5 000 ezer Ft"
 */
function formatCostRange(min: number, max: number): string {
  const minK = Math.round(min / 1000)
  const maxK = Math.round(max / 1000)
  return `${formatHuf(minK)} - ${formatHuf(maxK)} ezer Ft`
}

export function CostEstimationStep({
  inspectionId,
  defaultValues,
}: CostEstimationStepProps) {
  // Initialize with saved values or defaults from catalog
  const [items, setItems] = useState<CostItem[]>(() => {
    if (defaultValues && defaultValues.length > 0) {
      return defaultValues
    }
    return getDefaultCostItems()
  })
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(
    new Set()
  )

  const currentStep = useInspectionStore((s) => s.currentStep)
  const setStep = useInspectionStore((s) => s.setStep)
  const categories = getCostCategories()

  // Sync state when defaultValues changes (e.g., loading from Dexie)
  useEffect(() => {
    if (defaultValues && defaultValues.length > 0) {
      setItems(defaultValues)
    }
  }, [defaultValues])

  // Auto-save to Dexie
  const saveItems = useCallback(
    async (updatedItems: CostItem[]) => {
      try {
        await db.inspections
          .where('id')
          .equals(inspectionId)
          .modify((record) => {
            record.costItems = updatedItems
            record.updatedAt = new Date()
          })
      } catch {
        // Silently fail
      }
    },
    [inspectionId]
  )

  const handleToggleItem = (id: string) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, selected: !item.selected } : item
    )
    setItems(updated)
    saveItems(updated)
  }

  const toggleCategory = (category: string) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(category)) {
        next.delete(category)
      } else {
        next.add(category)
      }
      return next
    })
  }

  const handleNext = async () => {
    await saveItems(items)
    const nextStep = currentStep + 1
    await db.inspections.update(inspectionId, { currentStep: nextStep })
    setStep(nextStep)
  }

  const handlePrevious = async () => {
    await saveItems(items)
    const prevStep = currentStep - 1
    await db.inspections.update(inspectionId, { currentStep: prevStep })
    setStep(prevStep)
  }

  // Calculate totals
  const selectedItems = items.filter((item) => item.selected)
  const totalMin = selectedItems.reduce((sum, item) => sum + item.minCostHuf, 0)
  const totalMax = selectedItems.reduce((sum, item) => sum + item.maxCostHuf, 0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-stone-100">
          Koltsegbecsles
        </h2>
        <p className="mt-1 text-sm text-stone-400">
          Becsult nagysagrendek, nem pontos arajanlat
        </p>
      </div>

      {/* Category sections */}
      {categories.map((category) => {
        const categoryItems = items.filter(
          (item) => item.category === category
        )
        const isCollapsed = collapsedCategories.has(category)
        const selectedCount = categoryItems.filter((i) => i.selected).length

        return (
          <div
            key={category}
            className="rounded-xl border border-stone-700 bg-stone-800/50 overflow-hidden"
          >
            {/* Category header */}
            <button
              type="button"
              onClick={() => toggleCategory(category)}
              className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-stone-700/30"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm transition-transform ${
                    isCollapsed ? '' : 'rotate-90'
                  }`}
                >
                  &#9654;
                </span>
                <span className="font-medium text-stone-100">{category}</span>
                {selectedCount > 0 && (
                  <span className="rounded-full bg-amber-600 px-2 py-0.5 text-xs font-medium text-white">
                    {selectedCount}
                  </span>
                )}
              </div>
              <span className="text-xs text-stone-400">
                {categoryItems.length} tetel
              </span>
            </button>

            {/* Category items */}
            {!isCollapsed && (
              <div className="border-t border-stone-700 divide-y divide-stone-700/50">
                {categoryItems.map((item) => (
                  <label
                    key={item.id}
                    className={`flex min-h-[44px] cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-stone-700/20 ${
                      item.selected ? 'bg-amber-900/10' : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={item.selected}
                      onChange={() => handleToggleItem(item.id)}
                      className="h-5 w-5 rounded border-stone-600 bg-stone-900 text-amber-600 focus:ring-amber-600 focus:ring-offset-0"
                    />
                    <span className="flex-1 text-sm text-stone-200">
                      {item.description}
                    </span>
                    <span className="text-sm font-medium text-stone-400">
                      {formatCostRange(item.minCostHuf, item.maxCostHuf)}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )
      })}

      {/* Total summary */}
      <div className="rounded-xl border border-amber-700/50 bg-amber-900/20 p-4">
        <div className="flex items-center justify-between">
          <span className="font-medium text-stone-100">
            Becsult osszkoltseg:
          </span>
          <span className="text-lg font-bold text-amber-400">
            {selectedItems.length === 0
              ? '-'
              : `${formatHuf(Math.round(totalMin / 1000))} - ${formatHuf(
                  Math.round(totalMax / 1000)
                )} ezer Ft`}
          </span>
        </div>
        {selectedItems.length > 0 && (
          <p className="mt-1 text-right text-xs text-stone-400">
            {selectedItems.length} kijelolt tetel
          </p>
        )}
      </div>

      <StepNavigation
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </div>
  )
}
