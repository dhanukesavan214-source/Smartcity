# Project memory

## Product intent & audience

- Smart City Sustainability Portal — responsive multi-page civic web app.
- Public-facing features: civic issue reporting, smart parking, EV charging locator, live bus tracking.
- Admin-facing features: administrative dashboards with voice recognition for hands-free operation.
- Primary users: city residents and municipal administrators.

## Brand personality & voice

- Civic, trustworthy, modern sustainability tone.
- Professional but approachable; citizen-service oriented language.

## Visual design & UX direction

- Approved imagery: local uploaded logo and local module images only. Do not introduce remote stock-photo backgrounds.
- Original visual treatments to preserve:
  - Gradient header backgrounds.
  - Gradient login page background (no photo).
  - Map-based treatments for EV charging and bus tracking sections.
- "Polish passes" must not alter approved visual assets; changes should be additive to behavior/layout only.
- Responsive layout across mobile and desktop; multi-page navigation.

## Decisions, constraints & rationale

- Revert any remote stock-photo references that replaced approved local imagery or gradient/map treatments.
- Rationale: approved visuals are the canonical asset set; swapping them regresses the accepted design.
- Tech stack: Vite + React, Tailwind CSS, Lucide React icons, `@/` import alias to `src/`.
- Do not add UI/icon/theme packages beyond the template defaults unless explicitly requested.
- Known baseline: production build, type check, and lint pass with 3 non-blocking warnings — acceptable, not a regression.

## Open questions & assumptions

- Assumption: local logo and module images remain stored under project assets and referenced via `@/`.
- Assumption: voice recognition targets modern browsers via Web Speech API or equivalent (no extra package unless needed).
- Unconfirmed: exact gradient color values and final palette tokens — to be captured when specified.