# Roadmap: House Inspection Startup Website

## Overview

Six phases build the site in strict dependency order. The foundation phase establishes the technical scaffold, bilingual infrastructure, and optimized 3D asset pipeline — all three must exist before any rendering work begins. A static 3D scene proves the model loads correctly before scroll animation is layered on top. The scroll-to-camera binding is the highest-risk integration and executes only after the scene is independently stable. Service overlays complete the 3D experience by surfacing the business value at each inspection stop. The 2D content sections (hero, about, pricing, contact) run independently of 3D and are built clean in phase 5. Final polish addresses mobile quality tiers, SEO, and brand consistency before launch.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation** - Tech scaffold, i18n infrastructure, Zustand scroll store, and optimized GLTF asset pipeline
- [x] **Phase 2: Static 3D Scene** - House model visible in browser with correct lighting, Suspense loading screen, and stable HMR environment (completed 2026-02-23)
- [x] **Phase 3: Scroll-to-3D Binding** - Camera traverses inspection stops along spline path driven by scroll progress (completed 2026-02-23)
- [ ] **Phase 4: Inspection Overlays** - Animated bilingual service panels appear at each of the four inspection stops
- [ ] **Phase 5: 2D Content Sections** - Hero, About, Pricing, Testimonials, and Contact sections with callback form
- [ ] **Phase 6: Polish and Launch** - Mobile quality fallback, performance targets, SEO meta, and brand identity audit

## Phase Details

### Phase 1: Foundation
**Goal**: The technical foundation exists that every subsequent phase builds on — scroll state, bilingual text, and an optimized model file are all ready before any 3D or UI work begins
**Depends on**: Nothing (first phase)
**Requirements**: TECH-01, I18N-01, I18N-02, I18N-03, TECH-02
**Success Criteria** (what must be TRUE):
  1. Developer can run `npm run dev` and see a React page with no errors, Vite HMR working, TypeScript strict mode enabled
  2. Language switcher toggles the page between Hungarian and English text, and the chosen language persists after a hard reload
  3. The house GLB model file is compressed to under 5 MB with Draco or Meshopt encoding and can be verified with `gltf-transform` or equivalent tool
  4. A Zustand scroll store exists that updates a normalized 0-1 progress value on passive scroll events without causing React re-renders
**Plans**: 4 plans

Plans:
- [ ] 01-01-PLAN.md — Scaffold Vite + React + TypeScript project with Tailwind v4, ESLint, and dark theme
- [ ] 01-02-PLAN.md — Set up react-i18next with Hungarian/English translation files and language switcher
- [ ] 01-03-PLAN.md — Implement Zustand scroll store with passive scroll listener and progress tracking
- [ ] 01-04-PLAN.md — Build GLTF asset pipeline with gltf-transform Draco compression

### Phase 2: Static 3D Scene
**Goal**: The house model is visible in the browser with correct photorealistic lighting and a loading progress screen — proving the asset pipeline works end-to-end before any animation is attempted
**Depends on**: Phase 1
**Requirements**: 3DXP-01, 3DXP-05, LAND-02, TECH-04
**Success Criteria** (what must be TRUE):
  1. User opens the site and sees a loading progress indicator while the 3D model loads, then the house interior appears in the browser
  2. The house model renders with PBR materials and HDRI environment lighting — surfaces appear photorealistic, not flat-shaded
  3. The page loads within 3 seconds on a mid-range device (Lighthouse performance score measurable)
  4. Hot module replacement works without accumulating GPU memory leaks during development
**Plans**: 3 plans

Plans:
- [ ] 02-01-PLAN.md — Set up R3F Canvas with Suspense boundary and percentage-only loading screen overlay
- [ ] 02-02-PLAN.md — Load house GLTF model via useGLTF with preload, static camera at eye level, GPU cleanup
- [ ] 02-03-PLAN.md — Add HDRI environment map lighting for photorealistic PBR material rendering

### Phase 3: Scroll-to-3D Binding
**Goal**: Scrolling the page moves the camera through the house along a smooth spline path, pausing at four inspection stops — the core differentiating experience is functional
**Depends on**: Phase 2
**Requirements**: 3DXP-02, 3DXP-03, 3DXP-04, 3DXP-06, 3DXP-07
**Success Criteria** (what must be TRUE):
  1. Scrolling from top to bottom moves the camera through multiple rooms in a continuous, seamless walkthrough — no visible cuts between rooms
  2. The camera smoothly decelerates and pauses at exactly four inspection points (wall humidity, window thermal, electrical outlets, room dimensions)
  3. Animated highlight rings or glow effects appear on each inspection point when the camera arrives
  4. Camera motion uses depth-of-field post-processing that gives the scene a cinematic quality
  5. Users with prefers-reduced-motion enabled see static room views instead of the animated fly-through
**Plans**: 4 plans

Plans:
- [ ] 03-01-PLAN.md — Build CameraRig with CatmullRomCurve3 spline, scroll-driven camera, cinematic damping
- [ ] 03-02-PLAN.md — Implement sticky scroll zones for 4 inspection stops with close-up framing
- [ ] 03-03-PLAN.md — Add animated gold/amber glow rings and depth-of-field post-processing at stops
- [ ] 03-04-PLAN.md — Implement prefers-reduced-motion fallback with static room views

### Phase 4: Inspection Overlays
**Goal**: At each of the four inspection stops, an animated bilingual panel appears explaining the service — transforming the cinematic 3D experience into a selling tool
**Depends on**: Phase 3
**Requirements**: SERV-01, SERV-02, SERV-03, SERV-04, SERV-05, LAND-03, LAND-04
**Success Criteria** (what must be TRUE):
  1. When the camera arrives at each inspection stop, an animated overlay panel slides into view with the service name and description in the current language
  2. When the camera moves away from a stop, the overlay exits cleanly with an exit animation
  3. The thermal camera stop displays a false-color heat map visual effect as part of its overlay
  4. The laser measurement stop shows animated ruler or measurement line graphics
  5. The wall humidity stop shows an animated moisture gauge indicator
  6. A visual scroll cue prompts the user to start scrolling from the hero position, and a sticky CTA button appears after the user scrolls past the hero
**Plans**: 3 plans

Plans:
- [ ] 04-01-PLAN.md — Build overlay infrastructure: AnimatePresence layer, glassmorphism panel, bilingual content data, App integration
- [ ] 04-02-PLAN.md — Create four visual effect components (humidity gauge, thermal heatmap, electrical circuit, laser measurement) and integrate into overlay panel
- [ ] 04-03-PLAN.md — Build scroll cue animation at hero position and sticky CTA button after first stop

### Phase 5: 2D Content Sections
**Goal**: All non-3D content sections exist and convert visitors — hero, about, pricing, testimonials, and a working callback form that delivers leads
**Depends on**: Phase 1
**Requirements**: LAND-01, TRST-01, TRST-02, TRST-03, CONT-01, CONT-02, CONT-03, CONT-04
**Success Criteria** (what must be TRUE):
  1. The hero section displays the brand name, value proposition headline, and a working CTA button above the fold — visible before any scrolling
  2. The about section presents the founder's story, credentials, and experience in both languages
  3. The pricing section shows 2-3 service packages with a visually highlighted recommended tier
  4. Visitor can submit the callback form with their name and phone number and sees a success confirmation message
  5. On a mobile device, tapping the phone number in the footer initiates a phone call
**Plans**: TBD

Plans:
- [ ] 05-01: Build Hero section with brand name, value proposition, and CTA button in both languages
- [ ] 05-02: Build About section with founder credentials and Testimonials section with 3-5 reviews
- [ ] 05-03: Build Pricing section with 2-3 packages and recommended tier highlight
- [ ] 05-04: Build Contact section with callback form (React Hook Form + EmailJS), success confirmation, click-to-call link, and footer with contact info

### Phase 6: Polish and Launch
**Goal**: The site performs well on mobile devices, passes basic SEO requirements, and presents a consistent brand identity throughout — ready for real visitors
**Depends on**: Phase 5
**Requirements**: TECH-03, TECH-05, TECH-06
**Success Criteria** (what must be TRUE):
  1. On a mid-range Android or iPhone, the 3D scene loads and scrolls smoothly — if the device cannot handle it, a static fallback image displays instead of a broken canvas
  2. Sharing the site URL on social media shows correct title, description, and preview image via Open Graph tags
  3. The site presents a consistent brand identity — name, logo, color palette, and typography are unified across all sections in both languages
**Plans**: TBD

Plans:
- [ ] 06-01: Implement mobile 3D quality tier system with AdaptiveDpr, pixel ratio cap, and webglcontextlost fallback UI
- [ ] 06-02: Add SEO meta tags, Open Graph tags, and LocalBusiness structured data
- [ ] 06-03: Apply brand identity audit — logo, color palette, typography consistent across all sections

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

Note: Phase 5 depends only on Phase 1 (not on the 3D phases). It can be worked in parallel with Phases 2-4 if desired, but is scheduled sequentially here for solo development clarity.

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 4/4 | Complete | 2026-02-23 |
| 2. Static 3D Scene | 3/3 | Complete | 2026-02-23 |
| 3. Scroll-to-3D Binding | 0/4 | Complete    | 2026-02-23 |
| 4. Inspection Overlays | 0/3 | Not started | - |
| 5. 2D Content Sections | 0/4 | Not started | - |
| 6. Polish and Launch | 0/3 | Not started | - |
| 7. Scroll Sections Redesign | 3/3 | Complete | 2026-02-23 |

### Phase 7: Redesign scroll sections with meaningful content stops (Hero, How it works, 4 service sections)

**Goal:** The scroll experience displays 6 rich bilingual content sections (Hero, How it works, 4 services) synchronized with the 3D camera walkthrough, replacing placeholder HTML sections and simple overlay panels with full content that explains services, builds trust, and drives conversions
**Depends on:** Phase 4
**Requirements:** SERV-01, SERV-02, SERV-03, SERV-04, SERV-05, LAND-01, LAND-03, LAND-04
**Plans:** 3 plans

Plans:
- [x] 07-01-PLAN.md -- Restructure scroll zones for 6 stops, create section content configs, populate bilingual i18n files
- [x] 07-02-PLAN.md -- Build section components (SectionShell, HeroSection, HowItWorksSection, ServiceSection, ContentSectionLayer)
- [x] 07-03-PLAN.md -- Wire ContentSectionLayer into App, update scroll-dependent components, visual verification

### Phase 8: Admin inspection app with login, multi-step form (11 pages), photo upload, risk assessment, cost estimation, and PDF report generation for tablet/laptop use

**Goal:** A fully functional tablet/laptop field app for house inspectors: login, 11-page multi-step form with auto-save (project data, exterior, structure, moisture, thermal camera, windows, electrical, HVAC, laser measurements, risk assessment, cost estimation), photo capture with annotation, auto-calculated risk scores with manual override, and branded Hungarian-language PDF report generation
**Depends on:** Phase 7
**Plans:** 9 plans

Plans:
- [ ] 08-01-PLAN.md -- Foundation: React Router, Supabase auth, Dexie IndexedDB, TypeScript types, login page, dashboard
- [ ] 08-02-PLAN.md -- Form wizard infrastructure: stepper bar, auto-save, first 3 steps (Project Data, Exterior, Wall/Structure)
- [ ] 08-03-PLAN.md -- Moisture/Mold step with dynamic rooms, Thermal Camera step with ΔT calc, Windows/Doors step
- [ ] 08-04-PLAN.md -- Electrical, HVAC, and Laser Measurements steps
- [ ] 08-05-PLAN.md -- Photo capture, compression, annotation (marker.js 3), and gallery system
- [ ] 08-06-PLAN.md -- Risk calculation engine (TDD) + Risk Assessment and Cost Estimation steps
- [ ] 08-07-PLAN.md -- Summary page with section review, risk overrides, and photo gallery
- [ ] 08-08-PLAN.md -- PDF report generation with @react-pdf/renderer (all 8 report sections)
- [ ] 08-09-PLAN.md -- Cloud sync, photo gallery integration in form steps, end-to-end verification

### Phase 9: Marketing website UX/UI and conversion improvements

**Goal:** [To be planned]
**Depends on:** Phase 8
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd:plan-phase 9 to break down)
