# Storybook coverage report

Storybook was installed fresh for this repo (`@storybook/react-vite`, Vite 6 + React 19 + Tailwind v4). Scope for this pass is **stories only** — no test-runner, no Chromatic/visual regression, no `@storybook/addon-vitest`. Those were scaffolded by `storybook init` and deliberately removed to keep the install minimal; add them back later if the team wants automated story testing.

All components under `src/pages/client/Chat` (plus `ChatPage.tsx` and `ClientLayout.tsx`) were triaged and either covered or explicitly postponed with the user's sign-off. Shared fixtures/decorators live in `src/test-utils/`.

**Summary: 22 of 31 components covered (54 story variants), 9 postponed.**

## Covered — Easy (12 components, pure presentational)

| Component | Story file | Notes |
|---|---|---|
| ProgressBar | `ProgressBar/ProgressBar.stories.tsx` | 3 variants: mid-upload, just started, complete |
| MessageThreadButton | `MessageThreadButton/MessageThreadButton.stories.tsx` | 3 variants: default, no replies, many replies |
| MessageReaction | `MessageReaction/MessageReaction.stories.tsx` | Own vs. others' reaction |
| MessageReactions | `MessageReactions/MessageReactions.stories.tsx` | With reactions, empty |
| ReactionSelectionDialog | `ReactionSelectionDialog/ReactionSelectionDialog.stories.tsx` | Radix Popover/Tabs, full emoji list; with/without existing reactions |
| EmojiSuggestionsPopup | `EmojiSuggestionsPopup/EmojiSuggestionsPopup.stories.tsx` | Query match, no query, no matches |
| MessageUrlPreviewsComponent / MessageUrlPreviewComponent | `MessageUrlPreviewsComponent/*.stories.tsx` | Full preview, title-only, empty |
| MessageAttachments | `MessageAttachments/MessageAttachments.stories.tsx` | Single, multiple, empty |
| MessageAttachmentComponent | `MessageAttachmentComponent/MessageAttachmentComponent.stories.tsx` | image/gif/video/audio/binary variants; media previews render via an MSW redirect — see caveat below |
| FullscreenPreview | `FullscreenPreview/FullscreenPreview.stories.tsx` | Image and video overlay |
| **MessageComponent** (flagship) | `MessageComponent/MessageComponent.stories.tsx` | 7 variants: default, own message, with attachment, with reactions, edited, with thread, as reply |

## Covered — Medium (6 components, side effects on interaction or a single mockable context/mutation)

| Component | Story file | What's mocked |
|---|---|---|
| AudioAttachment | `AudioAttachment/AudioAttachment.stories.tsx` | Real sample audio URL for a working waveform; a broken-URL variant shows the graceful fallback (empty waveform, no throw) |
| MessageInput | `MessageInput/MessageInput.stories.tsx` | Baseline states (empty, editing, replying) plus editing-while-a-reply-is-pending, which documents that the edit banner takes priority over the reply quote (see ChatMessageList.tsx wiring). Voice/video recording and real upload flows in its children are *not* exercised here (see VoiceRecorderModal/VideoRecorderModal below, and MessageEditorAttachment's skipped "pending" variant) |
| MessageEditorAttachment | `MessageEditorAttachment/MessageEditorAttachment.stories.tsx` | "Uploaded" variant only (image + audio). The "pending" variant is **skipped** — it fires a real `uploadFileWithProgress` XHR in a `useEffect` on mount that can't be intercepted without a module-mocking addon (none installed in this pass) |
| WorkspaceCreateModal | `WorkspaceCreateModal/WorkspaceCreateModal.stories.tsx` | `MockedProvider` with an `AddWorkspace` mutation mock |
| ChannelsList | `ChannelsList/ChannelsList.stories.tsx` | `WorkspacesListContext` decorator; default + empty-channels variants. Opening "+ Create channel" mounts `CreateChannelModal`, which is covered separately below |
| UserSettingsPopup | `UserSettingsPopup/UserSettingsPopup.stories.tsx` | `UserContext` decorator only |

## Covered — Tricky (4 of 9, user chose full mock coverage)

| Component | Story file | What's mocked |
|---|---|---|
| WorkspacesList | `WorkspacesList/WorkspacesList.stories.tsx` | `WorkspacesListContext` + `UserContext` decorators + `MockedProvider` (`AddWorkspace` mutation), so both the switcher and the nested create-workspace flow work end to end |
| CreateChannelModal | `CreateChannelModal/CreateChannelModal.stories.tsx` | `WorkspacesListContext` + `ChannelTypesListContext` decorators + `MockedProvider` (`AddChannel` mutation) |
| VoiceRecorderModal | `VoiceRecorderModal/VoiceRecorderModal.stories.tsx` | `navigator.mediaDevices.getUserMedia` patched to return a synthetic oscillator-generated audio `MediaStream` (see `src/test-utils/decorators/withFakeMediaDevices.tsx`), so the real `MediaRecorder` genuinely records. A `PermissionDenied` variant simulates a rejected permission prompt |
| VideoRecorderModal | `VideoRecorderModal/VideoRecorderModal.stories.tsx` | Same technique using a canvas-captured synthetic video `MediaStream`. A `PermissionDenied` variant included |

Both recorder-modal stories rely on `AudioContext.createMediaStreamDestination` / `HTMLCanvasElement.captureStream`, supported in all evergreen browsers; they haven't been validated in older/headless Chromium test runners.

## Skipped / Postponed (5 components)

| Component | Reason | What full coverage would need |
|---|---|---|
| ChatMessageList | Heaviest component in the tree: `useApolloClient`, `UserContext`, `WebSocketEventEmitter` subscriptions for 6 event types, 5+ GraphQL mutations, `IntersectionObserver`/`ResizeObserver` for scroll. User chose to postpone. | `MockedProvider` covering all 5 mutations, a `UserContext` decorator, a mock `WebSocketEventEmitter` dispatch harness exercised via `play` functions, and IntersectionObserver/ResizeObserver either present in the target browser or polyfilled. |
| MessagesList | Thin wrapper around ChatMessageList; needs `useApolloClient` + a live `WebSocketEventEmitter` instance. User chose to postpone alongside ChatMessageList. | Same infra as ChatMessageList, applied to the wrapper's `loadMessages`/`isMessageInContext` callbacks. |
| Thread | Same pattern as MessagesList, wrapping ChatMessageList for a thread's root message. User chose to postpone. | Same as MessagesList. |
| ChatPage | Route-level page; aggregates `useWorkspaceChannelsList()` + `useWebsocket()` context and renders WorkspacesList/ChannelList/MessagesList/Thread together. User chose to postpone (recommended — low incremental value once children are covered). | All context decorators used above, composed together, plus a live-ish mock WebSocket provider and a real/mocked Apollo layer for the aggregated data flow. |
| ClientLayout | Composes `WebSocketContextProvider` + `ChannelTypesListProvider` (uses `useSuspenseQuery`, needs a Suspense boundary) + `WorkspacesListProvider` + `WorkspaceChannelsListProvider`, and implicitly depends on an ambient `UserContext` from a layout that isn't present under `client/`. User chose to postpone. | The same 4 decorators plus a Suspense boundary and an outer `UserContext` decorator; realistically only demonstrates provider wiring, not real behavior. |

## Caveats discovered while building this

- **Hardcoded attachment URL**: `MessageAttachmentComponent.tsx` and `MessageEditorAttachment.tsx` both build their display URL via a hardcoded `http://localhost:9000/chatney/${urlPath}` rather than an env-driven base URL — a pre-existing smell in the app code, left as-is (not touched) per scope. Since that host is presumably a real local MinIO instance in normal app dev, Storybook doesn't run a competing server on port 9000; instead `src/test-utils/mocks/attachmentUrlHandlers.ts` (wired up via `msw` + `msw-storybook-addon` in `.storybook/preview.tsx`) intercepts requests to that specific host at the browser network layer and serves real sample bytes (fetched from CORS-permissive public hosts, matched by file extension), so image/gif/video/audio previews all render normally in stories. The `AudioAttachment` `FailedToLoad` story opts out of this handler (`parameters.msw.handlers = []`) so it can still demonstrate the real failure path.
- **No dark-mode toolbar**: the app only supports dark mode via `prefers-color-scheme` media query, not a class-based toggle, so Storybook's preview has no manual dark/light switcher. Preview dark mode by changing your OS/browser color scheme.
- **AudioAttachment decode-failure behavior**: confirmed the component degrades gracefully (falls back to an empty/flat waveform) rather than throwing when `fetch`/`decodeAudioData` fails — see the `FailedToLoad` story variant.
- **`export` added to three context objects for testability**: `UserContext` (`src/contexts/UserContext.tsx`), `WorkspaceChannelsListContext` (`src/contexts/WorkspaceChannelsListContext.tsx`), and `ChannelTypesListContext` (`src/contexts/ChannelTypesListContext.tsx`) previously only exported their `Provider` component and `useX` hook, not the raw `Context` object. Each now also exports the `Context` itself so Storybook decorators can supply `Context.Provider value={...}` directly instead of using the real (side-effectful) provider components. `WorkspacesListContext` already exported its context and needed no change.
- **`MessageEditorAttachment`'s "pending" (in-progress upload) variant is not covered** — see the Medium table above.
- Test-runner/Chromatic/visual regression tooling is out of scope for this pass; `npx storybook add @storybook/addon-vitest` (or similar) can be layered in later if needed.
