# House Inspection Startup Website

## What This Is

A visually stunning single-page React web application for a house inspection startup. The centerpiece is a scroll-driven 3D walkthrough of a house interior (built with Three.js) where the camera moves through rooms, pausing at key inspection points — walls, windows, corners, electrical outlets, bathrooms — with animated overlays explaining each inspection service. The site is bilingual (Hungarian + English) and designed to be so visually memorable that visitors immediately associate quality with the brand.

## Core Value

The 3D scroll-driven house walkthrough must be breathtaking — it's the first impression, the differentiator, and the reason people remember the site. Everything else supports this experience.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] 3D house interior model rendered with Three.js
- [ ] Scroll-driven camera movement through rooms (continuous walkthrough feel)
- [ ] Camera pauses at inspection points with animated service overlays
- [ ] Inspection stops: wall (humidity), window (thermal/hőkamera), electrical outlets (electrical inspection), room dimensions (laser measurement)
- [ ] Seamless flow between rooms — feels like one continuous house
- [ ] Bilingual support (Hungarian + English) with language switcher
- [ ] Hero/landing section before the walkthrough begins
- [ ] About section (company story, credentials, experience)
- [ ] Pricing/packages section
- [ ] Testimonials section
- [ ] Callback contact form (name + phone number)
- [ ] Brand identity (name, logo, color palette, typography)
- [ ] Responsive design (mobile + desktop)
- [ ] Smooth Framer Motion UI animations for non-3D elements

### Out of Scope

- Multi-page routing — single page with vertical scrolling only
- Backend/CMS — static site, contact form can use a third-party service
- Online booking/scheduling system — simple callback form is enough for v1
- Blog or content pages — not needed for launch
- Video content hosting — 3D walkthrough replaces video

## Context

- The founder is starting a house inspection business in Hungary
- Services include: wall humidity measurement, thermal camera (hőkamera) imaging, laser dimension measurement, and electrical inspection
- The target audience is Hungarian homeowners/buyers, but English version needed for broader reach
- The reference site (davidlangarica.dev) uses Framer Motion, Three.js, and scroll-driven animations — this is the quality bar
- No existing branding — name, logo, and visual identity need to be created
- The 3D walkthrough is the hero feature: camera moves through a house interior, stopping at ~4 inspection points, each with animated text/overlay explaining the service

## Constraints

- **Tech stack**: React JS (required by founder), Three.js for 3D, Framer Motion for UI animations
- **Single page**: All content in one vertically scrolling page
- **Performance**: 3D scene must load fast and scroll smoothly on mid-range devices
- **Bilingual**: All user-facing text in both Hungarian and English

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Three.js for 3D (not CSS 3D or video) | Most immersive walkthrough experience, matches reference site quality | — Pending |
| Camera walkthrough (not cutaway/rotation) | Most cinematic, feels like walking through the house | — Pending |
| Simple callback form (not booking system) | Low complexity for v1, founder calls back personally | — Pending |
| Static site (no backend) | Faster to build, cheaper to host, form handled by third-party | — Pending |

---
*Last updated: 2026-02-23 after initialization*
