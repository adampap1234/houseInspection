# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-23)

**Core value:** The 3D scroll-driven house walkthrough must be breathtaking -- it's the first impression, the differentiator, and the reason people remember the site.
**Current focus:** Phase 8 COMPLETE -- Admin inspection app with full end-to-end flow

## Current Position

Phase: 8 (Admin Inspection App)
Plan: 9 of 9 in current phase
Status: Phase 8 COMPLETE
Last activity: 2026-02-24 -- Plan 08-09 complete: Cloud sync, photo gallery integration, end-to-end verification

Progress: [████████████████████] 100%

## Performance Metrics

**Velocity:**
- Total plans completed: 19
- Average duration: 6 min
- Total execution time: ~109 min

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1. Foundation | 4/4 | ~20 min | ~5 min |
| 2. Static 3D Scene | 3/3 | ~11 min | ~4 min |
| 7. Scroll Sections Redesign | 3/3 | ~9 min | ~3 min |
| 8. Admin Inspection App | 9/9 | ~69 min | ~8 min |

**Recent Trend:**
- Last 5 plans: 08-05 (~7m), 08-06 (7m), 08-07 (9m), 08-08 (10m), 08-09 (8m)
- Trend: Stable (~7-10 min per plan)

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [Init]: React Three Fiber (R3F) + Drei confirmed as 3D layer
- [Init]: Zustand chosen for scroll state -- getState() pattern for 60fps
- [Init]: Asset pipeline is Phase 1 prerequisite
- [Init]: Phase 5 (2D sections) depends only on Phase 1
- [Phase 1]: Tailwind v4 CSS-first @theme for color system (no JS config)
- [Phase 1]: Inter font self-hosted via @fontsource
- [Phase 1]: Hungarian (hu) as default/fallback language
- [Phase 1]: i18next-http-backend for lazy-loading translations
- [Phase 1]: Draco compression default for GLTF pipeline
- [Phase 2]: R3F Canvas defaults (sRGB + ACESFilmicToneMapping) for PBR
- [Phase 2]: Loading screen is percentage-only DOM overlay (not Drei Html)
- [Phase 2]: Golden Bay HDRI from Poly Haven for warm afternoon light
- [Phase 2]: No artificial lights -- HDRI-only lighting
- [Phase 2]: Camera at eye level (y=1.6), FOV 50, medium interior shot
- [Phase 7]: Section order follows camera spatial path (Hero -> HowItWorks -> Humidity -> Electrical -> Laser -> Thermal)
- [Phase 7]: SCROLL_PAGES increased from 3 to 7 for 6 rich content sections
- [Phase 7]: Hero and HowItWorks implemented as stop zones (not fly-through) for readability
- [Phase 7]: SectionShell + childVariants pattern for consistent glassmorphism panels
- [Phase 7]: Data-driven ServiceSection reads sectionConfigs (one component for 4 services)
- [Phase 7]: AnimatePresence mode='wait' for cinematic section transitions
- [Phase 7]: Header simplified to LanguageSwitcher only -- Hero section owns branding
- [Phase 7]: Main element is empty 700vh scroll-height provider (content rendered as fixed overlays)
- [Phase 7]: StickyCta threshold 0.15 (appears during Hero-to-HowItWorks fly-through)
- [Phase 7]: CameraRig verified unchanged -- bounds check handles arbitrary stop counts
- [Phase 8]: Supabase auth with offline mock mode -- app works fully without env vars
- [Phase 8]: Lazy-loaded admin routes via React.lazy to keep marketing bundle clean
- [Phase 8]: Dexie IndexedDB as offline-first source of truth for inspections and photos
- [Phase 8]: Hungarian-only UI text throughout admin app
- [Phase 8]: Warm dark theme (stone-800/900, amber accents) consistent with marketing site
- [Phase 8]: RoomAccordion uses CSS max-height transition for smooth expand/collapse
- [Phase 8]: Delta-T thresholds: <3C green, 3-5C yellow, >5C red
- [Phase 8]: useFieldArray + accordion pattern for dynamic per-room data collection
- [Phase 8]: zodResolver cast to any for Zod v4 + hookform/resolvers v5 compatibility
- [Phase 8]: useAutoSave uses Dexie modify() instead of update() for dynamic step keys
- [Phase 8]: FormStepWrapper + ChecklistField reusable patterns for all inspection steps
- [Phase 08]: Zod v4 schemas use local checklistItemSchema per file to avoid cross-file coupling
- [Phase 08]: marker.js 3 headless approach: custom toolbar UI with createMarker(string) API
- [Phase 08]: Dexie v2 schema migration for compound index [inspectionId+stepKey] on photos
- [Phase 08]: Annotation state JSON stored in annotationData field for re-editing
- [Phase 08]: Vitest added as test runner for TDD on pure business logic
- [Phase 08]: RiskAssessmentStep/CostEstimationStep use direct Dexie save (complex state, not FormStepWrapper)
- [Phase 08]: Cost ranges shown in "ezer Ft" with space separator (Hungarian convention)
- [Phase 08]: Summary as separate route (/admin/inspection/:id/summary) rather than step 11 in wizard
- [Phase 08]: SectionSummaryCard collapsed by default with border color indicating worst risk level
- [Phase 08]: Google Fonts CDN WOFF2 for Inter font in react-pdf (local @fontsource only has WOFF)
- [Phase 08]: Max 4 inline photos per section in PDF FindingsPage; overflow to separate PhotoPage
- [Phase 08]: ReportPreviewPage lazy-loaded to isolate ~1.6MB react-pdf bundle
- [Phase 08]: Background sync uses pub/sub pattern (not React state) for cross-component sync status
- [Phase 08]: isSupabaseConfigured() checks placeholder URL for graceful offline fallback
- [Phase 08]: Moisture step gets per-room PhotoGallery with roomId for room-scoped photos
- [Phase 08]: Thermal step defaults to thermal photo type via defaultPhotoType prop

### Roadmap Evolution

- Phase 7 added: Redesign scroll sections with meaningful content stops (Hero, How it works, 4 service sections)
- Phase 8 added: Admin inspection app with login, multi-step form (11 pages), photo upload, risk assessment, cost estimation, and PDF report generation for tablet/laptop use
- Phase 9 added: Marketing website UX/UI and conversion improvements

### Pending Todos

- User needs to provide GLB house model at assets/house-raw.glb
- Run npm run compress-model after placing model to generate public/models/house.glb
- Camera position may need tuning once real model is loaded

### Blockers/Concerns

- **[Research flag - Phase 3]:** Verify ScrollControls API in current Drei version before implementing CameraRig
- **[Research flag - Phase 5]:** Confirm EmailJS vs Netlify Forms based on final hosting platform before building contact form
- **[Resolved - Phase 2]:** Three.js color space -- R3F v9 handles sRGB correctly via defaults
- **[Open decision]:** 3D model sourcing (commission vs purchase vs free) -- needed for visual verification

## Session Continuity

Last session: 2026-02-24
Stopped at: Completed 08-09-PLAN.md -- Cloud sync, photo gallery integration, end-to-end verification. Phase 8 COMPLETE.
Resume file: None
