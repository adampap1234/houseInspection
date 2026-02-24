import { type ReactNode, useState } from 'react'

export interface RoomAccordionItem {
  id: string
  name: string
}

interface RoomAccordionProps {
  rooms: RoomAccordionItem[]
  expandedId: string | null
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  isComplete: (id: string) => boolean
  renderContent: (id: string, index: number) => ReactNode
}

export function RoomAccordion({
  rooms,
  expandedId,
  onToggle,
  onDelete,
  isComplete,
  renderContent,
}: RoomAccordionProps) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const handleDeleteClick = (id: string) => {
    setConfirmDeleteId(id)
  }

  const handleConfirmDelete = (id: string) => {
    onDelete(id)
    setConfirmDeleteId(null)
  }

  const handleCancelDelete = () => {
    setConfirmDeleteId(null)
  }

  if (rooms.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-stone-600 p-8 text-center text-stone-500">
        <p>Meg nincsenek szobak hozzaadva.</p>
        <p className="mt-1 text-sm">Hasznaja a fenti gombot szoba hozzaadasahoz.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {rooms.map((room, index) => {
        const isExpanded = room.id === expandedId
        const complete = isComplete(room.id)
        const showConfirm = confirmDeleteId === room.id

        return (
          <div
            key={room.id}
            className="overflow-hidden rounded-lg border border-stone-700 bg-stone-800/50"
          >
            {/* Accordion header */}
            <button
              type="button"
              onClick={() => onToggle(room.id)}
              className="flex min-h-[52px] w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-stone-700/50"
            >
              <div className="flex items-center gap-3">
                {/* Completion badge */}
                {complete ? (
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-600/20">
                    <svg
                      className="h-4 w-4 text-green-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                ) : (
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-stone-600 text-xs text-stone-500">
                    {index + 1}
                  </span>
                )}

                <span className="text-sm font-medium text-stone-200">
                  {room.name || `Szoba ${index + 1}`}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Delete button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteClick(room.id)
                  }}
                  className="rounded-md p-1.5 text-stone-500 transition-colors hover:bg-red-600/20 hover:text-red-400"
                  aria-label={`Szoba torlese: ${room.name || `Szoba ${index + 1}`}`}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>

                {/* Expand/collapse chevron */}
                <svg
                  className={`h-5 w-5 text-stone-500 transition-transform duration-200 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {/* Delete confirmation dialog */}
            {showConfirm && (
              <div className="border-t border-stone-700 bg-red-900/10 px-4 py-3">
                <p className="text-sm text-stone-300">
                  Biztosan torolni szeretne a(z){' '}
                  <span className="font-medium text-stone-100">
                    {room.name || `Szoba ${index + 1}`}
                  </span>{' '}
                  szobat?
                </p>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={handleCancelDelete}
                    className="rounded-md border border-stone-600 px-3 py-1.5 text-xs font-medium text-stone-300 transition-colors hover:bg-stone-700"
                  >
                    Megse
                  </button>
                  <button
                    type="button"
                    onClick={() => handleConfirmDelete(room.id)}
                    className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-500"
                  >
                    Torles
                  </button>
                </div>
              </div>
            )}

            {/* Expandable content */}
            <div
              className={`transition-all duration-200 ease-in-out ${
                isExpanded
                  ? 'max-h-[2000px] opacity-100'
                  : 'max-h-0 overflow-hidden opacity-0'
              }`}
            >
              <div className="border-t border-stone-700 p-4">
                {renderContent(room.id, index)}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
