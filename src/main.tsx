import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './i18n'
import './styles/index.css'
import App from './App.tsx'

// Lazy-load admin routes so marketing site never loads admin code
const LoginPage = lazy(() => import('./admin/pages/LoginPage.tsx').then(m => ({ default: m.LoginPage })))
const DashboardPage = lazy(() => import('./admin/pages/DashboardPage.tsx').then(m => ({ default: m.DashboardPage })))
const InspectionPage = lazy(() => import('./admin/pages/InspectionPage.tsx').then(m => ({ default: m.InspectionPage })))
const InspectionSummary = lazy(() => import('./admin/components/summary/InspectionSummary.tsx').then(m => ({ default: m.InspectionSummary })))
const ReportPreviewPage = lazy(() => import('./admin/pages/ReportPreviewPage.tsx').then(m => ({ default: m.ReportPreviewPage })))

const AdminFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-stone-900 text-stone-200">
    <p className="text-lg">Betoltese...</p>
  </div>
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/houseInspection">
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Marketing site */}
          <Route path="/" element={<App />} />

          {/* Admin inspection app */}
          <Route
            path="/admin/login"
            element={
              <Suspense fallback={<AdminFallback />}>
                <LoginPage />
              </Suspense>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <Suspense fallback={<AdminFallback />}>
                <DashboardPage />
              </Suspense>
            }
          />
          <Route
            path="/admin/inspection/:id"
            element={
              <Suspense fallback={<AdminFallback />}>
                <InspectionPage />
              </Suspense>
            }
          />
          <Route
            path="/admin/inspection/:id/summary"
            element={
              <Suspense fallback={<AdminFallback />}>
                <InspectionSummary />
              </Suspense>
            }
          />
          <Route
            path="/admin/inspection/:id/report"
            element={
              <Suspense fallback={<AdminFallback />}>
                <ReportPreviewPage />
              </Suspense>
            }
          />
          {/* /admin redirects to login */}
          <Route
            path="/admin"
            element={
              <Suspense fallback={<AdminFallback />}>
                <LoginPage />
              </Suspense>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
)
