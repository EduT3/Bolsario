# Bolsario

## Product and data

- Static, offline-first personal finance app. Keep index.html usable via file://.
- Preserve pierre-finance-v1 and bolsario.backup schema 2. Never reset real data during tests.
- Work in this folder; do not initialize Git here. Publication is a separate user request.
- Keep financial rules in app.js; use interface.js for presentation and interaction helpers.
- interface.js uses JSDoc with TypeScript strict checking. Do not suppress errors with any or ts-ignore.

## Interface

- Read docs/INTERFACE-AUDIT.md before changing the visual system.
- Use Manrope locally, tabular numerals, tokens in styles.css and Lucide from vendor/icons.js.
- No decorative cards, gradients or shadows on page sections. Radius <= 6px.
- Preserve separate views. Lists before editors; secondary tasks in subnavigation.
- Test both themes, keyboard, focus, empty/error states and 320-1440px widths.

## Quality gates

- npm ci
- npm run lint
- npm run typecheck
- npm test
- npm run build
- npm run test:browser
- npm run format:check
- Inspect Playwright screenshots, open the app and perform a second visual pass.
- Screenshots and fixtures must use synthetic data. artifacts/ is local and untracked.
- Strict typing applies to the new interface layer and tests; legacy financial JS is linted and unit-tested, not yet fully typed.
