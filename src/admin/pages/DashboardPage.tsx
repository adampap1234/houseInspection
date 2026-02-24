import { AdminLayout } from '../components/layout/AdminLayout.tsx'

export function DashboardPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-stone-100">Inspekcik</h2>
          <button
            className="rounded-lg bg-amber-600 px-5 py-2.5 font-medium text-white transition-colors hover:bg-amber-500"
          >
            + Uj inspekcio
          </button>
        </div>

        <div className="rounded-xl border border-stone-700 bg-stone-800 p-8 text-center text-stone-400">
          <p>Meg nincsenek inspekcik.</p>
          <p className="mt-1 text-sm">Hozzon letre egy ujat a fenti gombbal.</p>
        </div>
      </div>
    </AdminLayout>
  )
}
