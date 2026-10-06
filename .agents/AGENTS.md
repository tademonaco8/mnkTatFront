# mnkInkApp Rules

## Framework and Architecture
- Use **Angular 20**. Emphasize modern Angular features (e.g., Standalone Components, Signals).
- The app is a client-side SPA (no SSR), deployed to Netlify from `dist/mnkInkApp/browser`. Still guard `window`/`document` access with `isPlatformBrowser` so SSR or prerender can be added later.

## Styling
- Use plain CSS: one stylesheet per component, plus global styles in `src/styles.css` and the base reset in `src/reset.css`. Tailwind is NOT used.
- Respect `prefers-reduced-motion` for animations.
- Brand: always write "MNK Ink". Colors and fonts are CSS variables in `src/styles.css` (`--bg`, `--surface`, `--accent`, `--font-display`, `--font-body`); use them instead of new hex values. No blue/navy tones.
- Fonts are self-hosted with Fontsource (`@fontsource/grenze-gotisch`, `@fontsource-variable/inter`). `h1`/`h2` use the gothic display font; small headings inside cards/forms use `--font-body` (class `.text-heading`).
- Portfolio images are shown complete (masonry with CSS columns), never cropped. Add new photos to `src/app/shared/image-sizes.ts` with their real width/height.
- Images go in `src/assets/img` as WebP (max ~1200px wide). Use `<img loading="lazy">` with a meaningful `alt` instead of CSS background images for content.

## Templates
- Use the built-in control flow (`@if`, `@for` with a meaningful `track`) instead of `*ngIf` / `*ngFor`.
- Use `inject()` instead of constructor injection.

## Data Fetching and Services
- Communicate with the .NET Backend via Angular's `HttpClient`.
- Point API calls to the correct environment variable containing the backend URL.
- Booking times come from the backend (`GET /api/availability/slots`). Never hardcode available hours in the frontend.
- zone.js is loaded through `polyfills` in `angular.json` (never `import 'zone.js'` in `main.ts`): that is what lets the build downlevel `async/await` so the view refreshes after an `await`.
- Do not use `withFetch()` in `provideHttpClient` (it caused stale views with zone.js).
- Studio contact data lives in `src/app/shared/studio.ts`. The slot list is the shared `SlotPickerComponent` (used by `/turnos` and `/turnos/gestionar`).
- Wording: the client sends a "solicitud de turno"; the slot is reserved and the turno is "confirmado" only after design, budget and deposit are agreed. Never say "turno confirmado" right after the form.

## General Practices
- Use TypeScript strictly.
- Format code cleanly, utilizing Angular CLI defaults.

## Analytics
- Umami Cloud (no cookies). Website ID goes in `environment.production.ts` → `umamiWebsiteId`; only counts on mnkink.netlify.app.
- Track key actions with `AnalyticsService.track(...)`: `solicitud-enviada`, `galeria-detalle`, `turno-cancelado`, `turno-reprogramado`; WhatsApp/Instagram clicks are tracked automatically.

## Flash
- Designs live in `src/app/shared/flash.ts` (`FLASH_DESIGNS`), images in `src/assets/img/flash/`.
- With an empty list the section is fully hidden: no nav/footer link, no home block, and `/flash` (guarded with `canMatch`) falls back to home.
- "Lo quiero" links to `/turnos?flash=<id>`: the booking page shows the chosen design, preselects its duration and prepends "FLASH: ..." to the notes. Mark tattooed designs as `status: 'tomado'`.
- When the first designs go live, add `/flash` to `src/public/sitemap.xml`.
