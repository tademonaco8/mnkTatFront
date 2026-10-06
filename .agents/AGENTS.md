# mnkInkApp Rules

## Framework and Architecture
- Use **Angular 20**. Emphasize modern Angular features (e.g., Standalone Components, Signals).
- The app is a client-side SPA (no SSR), deployed to Netlify from `dist/mnkInkApp/browser`. Still guard `window`/`document` access with `isPlatformBrowser` so SSR or prerender can be added later.

## Styling
- Use plain CSS: one stylesheet per component, plus global styles in `src/styles.css` and the base reset in `src/reset.css`. Tailwind is NOT used.
- Respect `prefers-reduced-motion` for animations.
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
