# AGENTS.md

This file provides guidance to AI coding agents (Claude Code, Codex, Cursor, Gemini CLI, …) when working with code in this repository. `CLAUDE.md` imports it, so edit this file only.

Chatney frontend: a chat client (workspaces, channels, DMs, threads, reactions, attachments, voice/video messages) plus an admin area. React 19 + Vite 6 + TypeScript, Apollo Client 4 against a HotChocolate (.NET) GraphQL backend, Tailwind 4, Radix (`radix-ui` package). The backend lives in the sibling `chatney-backend` checkout.

## Commands

```bash
npm run dev            # Vite on http://localhost:5173/client (needs the backend, see .env.sample)
npm run build          # tsc -b && vite build — this is the type check
npm run lint           # eslint (also validates GraphQL documents against the schema)
npm test               # jest
npx jest src/helpers/utils.test.ts      # single test file
npx jest -t 'name of the test'          # single test by name
npm run storybook      # Storybook on :6006
```

CI (`.github/workflows/ci.yml`) runs `graphql:check`, `lint`, `build`, `test`.

The pre-existing `/img/hero.jpg` unresolved and >500 kB chunk warnings in `npm run build` are known.

## Generated GraphQL files: do not touch

Never edit `graphql/` (the backend's exported `schema.graphql`) or `src/graphql/generated/`, and do not run `npm run graphql:generate` / `graphql:check` (they rewrite the generated files). A developer regenerates them. Edit only the hand-written documents in `src/graphql/*.ts`, and tell the developer when codegen needs to be re-run. Stale extra entries in the generated files don't break the build.

`GRAPHQL.md` documents the schema → codegen → types pipeline and conventions:
- Operations are written with `graphql()` from `@/graphql/generated` (not `gql`); every operation/fragment needs a unique name.
- Shared selections are `<Entity>Fields` fragments; entity types in `src/types/*.ts` are aliases of the generated fragment types. Don't hand-write response/variable types.
- `DateTime` is a `string` on the client.

`GRAPHQL_IMPROVEMENTS.md` tracks the in-progress migration to Apollo-cache-owned state. Workspace channels (`WorkspaceChannelsListContext` + cache helpers in `src/graphql/channels.ts`) are the reference pattern. `merge: true` is set only for `ChannelQueries` in `GraphqlProvider.tsx`; read the doc before adding cache policies for other namespaces.

## Architecture

**Entry and routing (`src/App.tsx`).** `/login`, `/forgot-password`, `/reset-password` and `/install` are chosen by checking `window.location.pathname` *before* the router and render without `UserProvider`. Everything else goes through `BrowserRouter` + `UserProvider` and the route groups `adminRoutes()` (`/admin/roles`, `/admin/users`), `profileRoutes()`, `clientRoutes()` (`/client`, the chat). Paths are in `src/infra/consts.ts`.

**Providers.** Layouts (`ClientLayout`, `AdminLayout`, …) stack context providers with `composeProviders()` (`src/infra/composeProviders.tsx`). The chat stack is `WebSocketContextProvider` → roles → channel types → workspaces → workspace channels → direct messages. The roles, users, channel types, channel groups and system config contexts load with `useSuspenseQuery` (they suspend). The workspaces, workspace channels and direct messages contexts don't.

**Auth.** The token and user id live in `localStorage` (`userAuthToken`, `userAuthId`). `GraphqlProvider` adds the `Authorization` header and redirects to `/login` on `AUTH_NOT_AUTHENTICATED`/`UNAUTHENTICATED` or HTTP 401. `UserProvider` loads the current user and renders nothing until it has.

**Real-time updates.** `WebSocketContextProvider` opens `VITE_WEBSOCKET_URL` for the logged-in user and dispatches each `{ type, payload }` message on a typed `WebSocketEventEmitter` (`src/communication/WebSocketEventEmitter.ts`, which lists the event types and payloads). Contexts subscribe with `eventEmitter.addEventListener(type, handler, { signal })` and either patch the Apollo cache or refetch.

**Backend errors.** The backend sets `extensions.code` (`FORBIDDEN_ACTION`, `NOT_FOUND`, …; see `chatney-backend/ChatneyBackend/Infra/ErrorCodes.cs`). Use `getGraphQLErrorCode()` from `src/helpers/graphqlErrors.ts` to map a caught mutation error to a translated message. `useMutation` rejects on GraphQL errors, so wrap calls in try/catch.

**Uploads and media.** GraphQL uses `apollo-upload-client`. Attachment uploads with progress go through a raw `XMLHttpRequest` in `src/graphql/attachments.ts`. Audio/video are preprocessed in the browser with ffmpeg.wasm (`src/helpers/attachments/ffmpeg/`, excluded from Vite's `optimizeDeps`).

## Localization

- i18next is configured in `src/i18n.ts`. Bundled resources are `src/locales/{en,ru,uk}.yml`, imported through `@rollup/plugin-yaml`.
- The language comes only from the browser (navigator) and falls back to `en`. Nothing is persisted and there is no language switcher yet.
- All user-visible text goes through `t()`: text, placeholders, `aria-label`, `title`, `alt` and validation messages. Helpers take `t: TFunction` as a parameter instead of importing i18n (see `validateNickname`).
- Plurals use i18next suffixes: `_one/_other` for en, `_one/_few/_many/_other` for ru and uk.
- `src/locales/locales.test.ts` fails unless all three files have the same keys, so add every key to all three.

## Conventions

- Import alias `@/` → `src/`. Jest (ts-jest, node environment) has **no** `@/` mapper, so tests use relative imports, and modules that import via `@/` can't be unit-tested directly. Tests are `*.test.ts` next to the code and excluded from `tsconfig.app.json`.
- Styling: per-component CSS modules that start with `@reference "tailwindcss";` and use `@apply`.
- ESLint (`src/`): 4-space indent (`@stylistic/indent`, `case` indented inside `switch`), single quotes, `curly: all`, 1TBS braces, `react-hooks` rules. `npm run lint:fix` fixes most style errors.
- Destructive confirmations use `src/components/ConfirmDialog` (Radix `AlertDialog`), not `window.confirm`.
- Storybook stories are colocated as `X.stories.tsx` and use `Meta<typeof X>`, JSDoc on each story, and no autodocs. Shared fixtures, decorators and MSW handlers are in `src/test-utils/`. `.storybook/preview.tsx` forces English. The `storybook-stories` skill's references to `@agh/ui` and a `stories/` folder come from another repo; follow the local conventions instead. `STORYBOOK_COVERAGE.md` records what is covered.

## Runtime verification

Follow the `chatney-frontend-verify` skill (dev server, backend, Playwright recipe). Project skills are mirrored in `.agents/skills/` and `.claude/skills/`; keep the two copies identical. The dev DB is seeded by `chatney-backend/ChatneyBackend/Domains/InstallWizard/InstallWizardMutations.cs`:
- `admin` / `admin` has full permissions.
- `test1`…`testN` / `123` have no role permissions; mutations return `FORBIDDEN_ACTION`.

Writes during verification persist in the dev DB.
