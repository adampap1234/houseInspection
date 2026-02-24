import { useNavigate } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { AdminLayout } from '../components/layout/AdminLayout.tsx'
import { db } from '../lib/db.ts'
import { DEFAULT_INSPECTION } from '../types/inspection.ts'
import { format } from 'date-fns'

const defaultStatusConfig = { label: 'Fuggo', color: 'bg-yellow-500/20 text-yellow-400' }

const syncStatusLabels: Record<string, { label: string; color: string }> = {
  pending: defaultStatusConfig,
  synced: { label: 'Szinkronizalva', color: 'bg-green-500/20 text-green-400' },
  error: { label: 'Hiba', color: 'bg-red-500/20 text-red-400' },
}

export function DashboardPage() {
  const navigate = useNavigate()

  const inspections = useLiveQuery(
    () => db.inspections.orderBy('createdAt').reverse().toArray(),
    []
  )

  const handleCreateInspection = async () => {
    const newInspection = DEFAULT_INSPECTION()
    await db.inspections.add(newInspection)
    navigate(`/admin/inspection/${newInspection.id}`)
  }

  const handleOpenInspection = (id: string) => {
    navigate(`/admin/inspection/${id}`)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-stone-100">Inspekcik</h2>
          <button
            onClick={handleCreateInspection}
            className="rounded-lg bg-amber-600 px-5 py-2.5 font-medium text-white transition-colors hover:bg-amber-500"
          >
            + Uj inspekcio
          </button>
        </div>

        {inspections === undefined ? (
          <div className="rounded-xl border border-stone-700 bg-stone-800 p-8 text-center text-stone-400">
            <p>Betoltese...</p>
          </div>
        ) : inspections.length === 0 ? (
          <div className="rounded-xl border border-stone-700 bg-stone-800 p-8 text-center text-stone-400">
            <p>Meg nincsenek inspekcik.</p>
            <p className="mt-1 text-sm">Hozzon letre egy ujat a fenti gombbal.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {inspections.map((inspection) => {
              const statusConfig = syncStatusLabels[inspection.syncStatus] ?? defaultStatusConfig
              return (
                <button
                  key={inspection.id}
                  onClick={() => handleOpenInspection(inspection.id)}
                  className="flex w-full items-center justify-between rounded-xl border border-stone-700 bg-stone-800 p-4 text-left transition-colors hover:border-stone-600 hover:bg-stone-750"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-lg font-medium text-stone-100">
                      {inspection.projectData.clientName || 'Nev nelkuli inspekcio'}
                    </p>
                    <p className="truncate text-sm text-stone-400">
                      {inspection.projectData.address || 'Nincs cim megadva'}
                    </p>
                    <p className="mt-1 text-xs text-stone-500">
                      Modositva: {format(new Date(inspection.updatedAt), 'yyyy.MM.dd HH:mm')}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${statusConfig.color}`}>
                      {statusConfig.label}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
