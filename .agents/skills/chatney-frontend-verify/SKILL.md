---
name: chatney-frontend-verify
description: How to run and drive the Chatney frontend for runtime verification (dev server, backend, test login, Playwright recipe).
---

# Verifying chatney-frontend changes at runtime

## Prerequisites (usually already running)

- Backend GraphQL at `http://localhost:3001/query` (from `.env` `VITE_API_URL`); quick check: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/query` (any HTTP response means it's up).
- Frontend dev server: `npm run dev` → `http://localhost:5173/client` (Vite, HMR picks up edits). Often already running on 5173.

## Auth / getting into the chat

- `http://localhost:5173/` redirects to `/login` with Login/Register tabs.
- No fixed test credentials: register a throwaway user through the Register tab (fields `#email`, `#password`, `#username`), which redirects back to `/login`; then log in (fields `#login`, `#password`). Token lands in localStorage.
- The dev backend is seeded: workspace "Main" with channels `public 1`, `public 2`, `private 1`, `private 2`; `public 1` contains a "hello world" message from "test user 1" — useful for anything that needs an existing message (reactions, threads, editing).

## Browser driving (no Playwright in devDependencies)

- Install the `playwright` npm package in a temp dir. If a Playwright browser cache already exists on the machine, reuse it instead of downloading (~150 MB); otherwise run `npx playwright install chromium` once.
- Cache location per OS:
  - Windows: `%LOCALAPPDATA%\ms-playwright`
  - macOS: `~/Library/Caches/ms-playwright`
  - Linux: `~/.cache/ms-playwright`
- If the cached `chromium-<revision>` doesn't match your installed playwright version, sidestep the revision check by launching with an explicit `executablePath` to the browser binary inside that dir (`chrome-win\chrome.exe` on Windows, `chrome-mac/Chromium.app/Contents/MacOS/Chromium` on macOS, `chrome-linux/chrome` on Linux):

```js
import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: exe, headless: true }); // omit executablePath if revisions match
```

- Radix popovers render in a portal: locate via `[data-radix-popper-content-wrapper]`.
- Message hover actions (reply, add reaction) are always in the DOM; the reaction picker trigger is `getByRole('button', { name: 'Add reaction' })`.

## Gotchas

- Writes are real: reactions/messages you add persist in the seeded dev DB.
- `npm run build` = `tsc -b && vite build`; pre-existing warnings: `/img/hero.jpg` unresolved, main chunk >500 kB — not caused by your change.
