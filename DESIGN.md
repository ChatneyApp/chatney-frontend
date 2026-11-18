---
version: alpha
name: Chatney
description: Dark, dense team chat (workspaces, channels, direct messages, threads) with an admin area. Documents the interface as it is built today.
colors:
  primary: "#4f39f6"

  # Chat tokens. Same names as the @theme block in src/index.css (bg-surface, text-text-muted, ...).
  canvas: "#0b1122"
  surface: "#151d33"
  surface-own: "#1a2340"
  surface-panel: "#131a30"
  surface-sunken: "#0f1526"
  surface-hover: "#24314d"
  sidebar: "#17202d"
  overlay: "#000000bf"
  border: "#232e4d"
  border-strong: "#2f3c66"
  border-hover: "#3a4a7d"
  text: "#ffffff"
  text-body: "#dbe1f4"
  text-secondary: "#9aa3c0"
  text-muted: "#7d87a8"
  text-dim: "#5f6a8c"
  accent: "#4f39f6"
  accent-hover: "#615fff"
  accent-text: "#a3b3ff"
  accent-tint: "#615fff33"
  accent-counter: "#9ca6ff"
  on-accent: "#ffffff"
  link: "#7c86ff"
  focus: "#8f96ff"
  danger: "#e7000b"
  danger-hover: "#fb2c36"
  danger-text: "#ff6467"
  danger-wash: "#fb2c361a"
  danger-tint: "#fb2c3633"
  danger-line: "#fb2c3666"
  success-text: "#5ee9b5"
  success-wash: "#00bc7d1a"
  success-tint: "#00bc7d33"
  success-line: "#00bc7d66"
  warning-text: "#ffd230"
  warning-wash: "#fe9a001a"
  warning-tint: "#fe9a0033"
  warning-line: "#fe9a0066"

  # Chat surfaces that are hard-coded in component styles, not tokens yet.
  composer: "#141c33"
  chip: "#111a30"
  preview: "#101830"
  attachment: "#1b2440"
  attachment-tile: "#232e52"
  picker: "#1d2a44"
  picker-field: "#071226"
  picker-active: "#273653"
  picker-text: "#e9edff"

  # Neutral gray family (Tailwind gray): admin, profile, dialogs, channel sidebar, workspace rail.
  gray-950: "#030712"
  gray-900: "#101828"
  gray-800: "#1e2939"
  gray-700: "#364153"
  gray-600: "#4a5565"
  gray-500: "#6a7282"
  gray-400: "#99a1af"
  gray-300: "#d1d5dc"
  gray-200: "#e5e7eb"

  # Other Tailwind colors used by single components.
  red-300: "#ffa2a2"
  blue-600: "#155dfc"
  blue-700: "#1447e6"
  sky-500: "#00a6f4"
  sky-400: "#00bcff"
  emerald-400: "#00d492"
  emerald-950: "#002c22"
  slate-950: "#020618"
  slate-900: "#0f172b"
  slate-100: "#f1f5f9"

  # Sign-in pages.
  auth-canvas: "#0a0f1a"
  auth-card: "#131a2b"
  auth-field: "#1a2236"
  auth-gradient-start: "#c4b5fd"
  auth-gradient-mid: "#a5b4fc"
  auth-gradient-end: "#818cf8"
  auth-on-gradient: "#0f172a"

  # Install wizard and loading screen.
  install-canvas: "#090d18"
  install-shell: "#111827"
  install-sidebar: "#0d1424"
  install-form: "#131b2d"

  # Logo only. Never used for interface elements.
  logo-orange: "#ff5a36"
  logo-navy: "#1b1b3a"
  logo-white: "#ffffff"
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.333
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.4
  title:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.556
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.625
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.429
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.429
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.333
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.333
  overline:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: 0.14em
  counter:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1
  timer:
    fontFamily: ui-monospace
    fontSize: 24px
    fontWeight: 400
    lineHeight: 1.333
rounded:
  sm: 4px
  md: 6px
  lg: 8px
  xl: 12px
  2xl: 16px
  picker: 21.6px
  card: 28px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 20px
  2xl: 24px
  workspace-rail: 64px
  channel-sidebar: 192px
  admin-sidebar: 224px
  message-max-width: 36em
  auth-card-width: 420px
  profile-column: 672px
  install-shell-width: 980px
  install-sidebar: 310px
components:
  # Chat
  message-bubble:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-body}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.2xl}"
    padding: 16px
  message-bubble-own:
    backgroundColor: "{colors.surface-own}"
    textColor: "{colors.text-body}"
  composer:
    backgroundColor: "{colors.composer}"
    textColor: "{colors.text-body}"
    rounded: "{rounded.2xl}"
    padding: 12px
  send-button:
    backgroundColor: "{colors.accent-hover}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.xl}"
    size: 40px
  send-button-hover:
    backgroundColor: "{colors.link}"
    textColor: "{colors.on-accent}"
  send-button-disabled:
    backgroundColor: "{colors.border}"
    textColor: "{colors.text-dim}"
  reaction-chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.accent-counter}"
    typography: "{typography.counter}"
    rounded: "{rounded.full}"
    height: 36px
    padding: 12px
  reaction-chip-hover:
    backgroundColor: "{colors.surface-hover}"
    textColor: "{colors.accent-counter}"
  thread-button:
    backgroundColor: "{colors.chip}"
    textColor: "{colors.accent-text}"
    rounded: "{rounded.full}"
    height: 36px
    padding: 12px
  thread-button-hover:
    backgroundColor: "{colors.surface-hover}"
    textColor: "{colors.accent-text}"
  message-toolbar:
    backgroundColor: "{colors.surface-sunken}"
    textColor: "{colors.text-muted}"
    rounded: "{rounded.lg}"
    padding: 4px
  message-toolbar-button:
    backgroundColor: "{colors.surface-sunken}"
    textColor: "{colors.text-muted}"
    rounded: "{rounded.md}"
    size: 28px
  message-toolbar-button-hover:
    backgroundColor: "{colors.surface-hover}"
    textColor: "{colors.accent-text}"
  link-preview:
    backgroundColor: "{colors.preview}"
    textColor: "{colors.text}"
    rounded: "{rounded.xl}"
    padding: 16px
  file-attachment:
    backgroundColor: "{colors.attachment}"
    textColor: "{colors.text}"
    rounded: "{rounded.xl}"
    padding: 12px
  file-attachment-icon-tile:
    backgroundColor: "{colors.attachment-tile}"
    textColor: "{colors.accent-text}"
    rounded: "{rounded.lg}"
    size: 40px
  audio-player:
    backgroundColor: "{colors.slate-900}"
    textColor: "{colors.slate-100}"
    rounded: "{rounded.2xl}"
    padding: 12px
  audio-play-button:
    backgroundColor: "{colors.sky-500}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.full}"
    size: 40px
  audio-play-button-hover:
    backgroundColor: "{colors.sky-400}"
    textColor: "{colors.on-accent}"
  emoji-picker:
    backgroundColor: "{colors.picker}"
    textColor: "{colors.picker-text}"
    rounded: "{rounded.picker}"
    width: 464px
  emoji-picker-search:
    backgroundColor: "{colors.picker-field}"
    textColor: "{colors.picker-text}"
    rounded: "{rounded.2xl}"
    height: 68px
  emoji-picker-tab-active:
    backgroundColor: "{colors.picker-active}"
    textColor: "{colors.picker-text}"
    rounded: "{rounded.xl}"
    size: 36px
  thread-panel:
    backgroundColor: "{colors.surface-panel}"
    textColor: "{colors.text}"
  channel-sidebar:
    backgroundColor: "{colors.sidebar}"
    textColor: "{colors.gray-400}"
    width: 192px
    padding: 16px
  channel-item:
    backgroundColor: "{colors.sidebar}"
    textColor: "{colors.gray-400}"
    rounded: "{rounded.sm}"
    padding: 4px
  channel-item-hover:
    backgroundColor: "{colors.gray-700}"
    textColor: "{colors.gray-400}"
  channel-item-active:
    backgroundColor: "{colors.sidebar}"
    textColor: "{colors.text}"
  workspace-rail:
    backgroundColor: "{colors.gray-800}"
    textColor: "{colors.text}"
    width: 64px
  workspace-button:
    backgroundColor: "{colors.gray-700}"
    textColor: "{colors.text}"
    rounded: "{rounded.full}"
    size: 40px
  workspace-button-active:
    backgroundColor: "{colors.gray-500}"
    textColor: "{colors.text}"

  # Admin, profile and dialogs
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: 8px
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
    textColor: "{colors.on-accent}"
  button-primary-disabled:
    backgroundColor: "{colors.gray-600}"
    textColor: "{colors.gray-400}"
  button-ghost:
    backgroundColor: "{colors.gray-800}"
    textColor: "{colors.gray-300}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: 6px
  button-ghost-hover:
    backgroundColor: "{colors.gray-800}"
    textColor: "{colors.text}"
  button-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.on-accent}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: 6px
  button-danger-hover:
    backgroundColor: "{colors.danger-hover}"
    textColor: "{colors.on-accent}"
  input:
    backgroundColor: "{colors.gray-700}"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    padding: 8px
  dialog:
    backgroundColor: "{colors.gray-800}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: 20px
  card:
    backgroundColor: "{colors.gray-800}"
    textColor: "{colors.text}"
    rounded: "{rounded.lg}"
    padding: 20px
  admin-sidebar:
    backgroundColor: "{colors.gray-950}"
    textColor: "{colors.gray-300}"
    width: 224px
  admin-nav-link-active:
    backgroundColor: "{colors.gray-800}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
  table-header:
    backgroundColor: "{colors.gray-800}"
    textColor: "{colors.gray-400}"
    typography: "{typography.label-sm}"
  table-row:
    backgroundColor: "{colors.gray-900}"
    textColor: "{colors.text}"
    typography: "{typography.body-md}"
  badge-positive:
    backgroundColor: "{colors.success-tint}"
    textColor: "{colors.success-text}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
  badge-warning:
    backgroundColor: "{colors.warning-tint}"
    textColor: "{colors.warning-text}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
  badge-danger:
    backgroundColor: "{colors.danger-tint}"
    textColor: "{colors.red-300}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
  badge-neutral:
    backgroundColor: "{colors.gray-700}"
    textColor: "{colors.gray-300}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"

  # Create channel and create workspace dialogs
  button-create:
    backgroundColor: "{colors.blue-600}"
    textColor: "{colors.on-accent}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: 4px
  button-create-hover:
    backgroundColor: "{colors.blue-700}"
    textColor: "{colors.on-accent}"

  # Sign-in pages
  auth-page:
    backgroundColor: "{colors.auth-canvas}"
    textColor: "{colors.gray-400}"
  auth-card:
    backgroundColor: "{colors.auth-card}"
    textColor: "{colors.text}"
    rounded: "{rounded.card}"
    padding: 32px
    width: 420px
  auth-input:
    backgroundColor: "{colors.auth-field}"
    textColor: "{colors.text}"
    typography: "{typography.body-md}"
    rounded: "{rounded.2xl}"
    padding: 14px
  auth-submit:
    backgroundColor: "{colors.auth-gradient-mid}"
    textColor: "{colors.auth-on-gradient}"
    rounded: "{rounded.2xl}"
    padding: 14px

  # Install wizard
  wizard-page:
    backgroundColor: "{colors.install-canvas}"
    textColor: "{colors.gray-200}"
  wizard-shell:
    backgroundColor: "{colors.install-shell}"
    textColor: "{colors.text}"
    rounded: "{rounded.card}"
    width: 980px
  wizard-sidebar:
    backgroundColor: "{colors.install-sidebar}"
    textColor: "{colors.text}"
    width: 310px
    padding: 32px
  wizard-form:
    backgroundColor: "{colors.install-form}"
    textColor: "{colors.text}"
    padding: 40px
  wizard-input:
    backgroundColor: "{colors.install-sidebar}"
    textColor: "{colors.text}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    height: 48px
  wizard-button-primary:
    backgroundColor: "{colors.link}"
    textColor: "{colors.slate-950}"
    typography: "{typography.label-md}"
    rounded: "{rounded.xl}"
    height: 44px
  wizard-button-primary-hover:
    backgroundColor: "{colors.accent-text}"
    textColor: "{colors.slate-950}"
  wizard-button-install:
    backgroundColor: "{colors.emerald-400}"
    textColor: "{colors.emerald-950}"
    rounded: "{rounded.xl}"
    height: 56px
  wizard-button-install-hover:
    backgroundColor: "{colors.success-text}"
    textColor: "{colors.emerald-950}"

  # Logo
  logo-tile:
    backgroundColor: "{colors.logo-orange}"
    textColor: "{colors.logo-white}"
---

# Chatney design

This file describes how Chatney looks today, for design AI tools and for people. The tokens above are the exact values in the code. Where the same element is styled differently in different parts of the product, both are recorded. The last section lists those differences.

## Overview

Chatney is a self-hosted team chat: workspaces, channels grouped into categories, direct messages, threads, emoji reactions, file attachments, voice and video messages. An admin area manages users, roles, workspaces, channels and system settings.

The interface is dark only. There is no light theme. It is built for desktop browsers: the chat is a row of fixed-width columns and has no mobile layout. Text is small and dense (14 px is the default size). Indigo is the only accent. Depth comes from stepped dark surfaces and 1 px borders more than from shadows.

The product has four visual areas. Design a new screen in the style of the area it belongs to.

| Area | Screens | Look |
|---|---|---|
| Chat | Message list, composer, threads, reactions, emoji picker, attachments | Deep navy surfaces, soft blue-gray text, large radii (12 to 16 px), built on the Chatney tokens |
| Gray | Admin pages, profile, dialogs, channel sidebar, workspace rail | Neutral dark gray, small radii (4 to 8 px), flat, tables and forms |
| Sign-in | Log in, register, forgot and reset password | One centered card with a 28 px radius, pill-like fields, a lavender gradient button |
| Install wizard | First-run setup, loading screen | Wide two-pane card with a stepper, soft indigo glow in the background, light indigo and emerald buttons with dark text |

Interface text is translated into English, Russian and Ukrainian.

## Colors

### Chat (navy tokens)

- **Surfaces**, darkest to lightest:
  - `surface-sunken` `#0f1526`: reply quotes, the floating message toolbar.
  - `canvas` `#0b1122`: background of the message column.
  - `surface-panel` `#131a30`: the thread panel.
  - `surface` `#151d33`: message bubbles.
  - `surface-own` `#1a2340`: your own message bubbles.
  - `surface-hover` `#24314d`: hover fill for chips and icon buttons.
- **Borders:** `border` `#232e4d` by default, `border-strong` `#2f3c66` on own messages and the toolbar, `border-hover` `#3a4a7d` on hover and focus-within.
- **Text:** `text` white for titles and names, `text-body` `#dbe1f4` for message text, `text-secondary` `#9aa3c0`, `text-muted` `#7d87a8` for timestamps and idle icons, `text-dim` `#5f6a8c` for disabled and empty states.
- **Accent (indigo):**
  - `accent` `#4f39f6` (indigo 600): filled primary buttons.
  - `accent-hover` `#615fff` (indigo 500): their hover, and the send button.
  - `link` `#7c86ff` (indigo 400): links, the left bar of a quote.
  - `accent-text` `#a3b3ff` (indigo 300): the channel title, icon hover, small uppercase labels.
  - `accent-counter` `#9ca6ff`: reaction and thread counters.
  - `focus` `#8f96ff`: the 2 px focus outline.
- **Hard-coded chat surfaces** (close to the tokens, not tokens yet): composer `#141c33`, thread button `#111a30`, link preview `#101830`, file attachment `#1b2440` with icon tile `#232e52`, emoji picker `#1d2a44` with search field `#071226` and active tab `#273653`.
- **User colors:** each user gets a stable hue from their id. The name in a message is `hsl(hue 70% 72%)`. The avatar fallback is white initials on `hsl(hue 45% 40%)`.

### Gray family

Admin, profile, dialogs, the channel sidebar and the workspace rail use Tailwind gray:

| Token | Hex | Use |
|---|---|---|
| `gray-950` | `#030712` | Admin sidebar |
| `gray-900` | `#101828` | Page background, table rows |
| `gray-800` | `#1e2939` | Dialogs, cards, table header, active nav link, workspace rail |
| `gray-700` | `#364153` | Borders, input fill, neutral badge, hover fill in the channel list |
| `gray-600` | `#4a5565` | Input border, disabled button fill |
| `gray-500` | `#6a7282` | Hints, secondary cell text, section labels |
| `gray-400` | `#99a1af` | Subtitles, channel names, disabled button text |
| `gray-300` | `#d1d5dc` | Field labels, text buttons, nav links |
| `gray-200` | `#e5e7eb` | Secondary text in popups |

The channel sidebar background is `sidebar` `#17202d`, a blue-tinted gray.

### Status

Status colors are used the same way everywhere: a light text color on a transparent wash of the same hue, often with a border of that hue.

- **Danger (red):** solid `#e7000b` with hover `#fb2c36` for destructive buttons. Error text `#ff6467`. Banners use a 10% red wash, a 40% red border and `#ffa2a2` text. Badges use a 20% wash.
- **Success (emerald):** text `#5ee9b5` on a 10% or 20% wash of `#00bc7d`.
- **Warning (amber):** text `#ffd230` on a 10% or 20% wash of `#fe9a00`.

### Sign-in and install wizard

- Sign-in: page `#0a0f1a`, card `#131a2b`, fields `#1a2236`, borders white at 5 to 10% opacity. The submit button is a left-to-right gradient `#c4b5fd` → `#a5b4fc` → `#818cf8` with `#0f172a` text.
- Install wizard: page `#090d18` with two soft radial glows (indigo at 12% top left, sky at 8% bottom right), shell `#111827`, left pane and fields `#0d1424`, form pane `#131b2d`. Buttons are light with dark text: indigo 400 `#7c86ff` for "next", emerald 400 `#00d492` for "install".

### Logo colors

`logo-orange` `#ff5a36`, `logo-navy` `#1b1b3a` and white belong to the logo. They are not used for interface elements.

## Typography

- **Font:** `Inter, system-ui, Avenir, Helvetica, Arial, sans-serif`. Inter is named first but the app does not ship or load it, so most people see their system font. Design with Inter or a system UI font.
- **Emoji:** Noto Color Emoji, bundled with the app, then the platform emoji fonts.
- **Weights:** 400 body, 500 labels and buttons, 600 headings and names, 700 for the channel title, thread title and active channel.

| Token | Size / weight | Use |
|---|---|---|
| `headline-lg` | 30 px / 600, tight tracking | Install wizard heading |
| `headline-md` | 24 px / 600 | Admin page titles, sign-in title (26 px there) |
| `headline-sm` | 20 px / 600 | Profile name, wizard step titles |
| `title` | 18 px / 600 | Dialog titles, section titles, channel and thread headers (700) |
| `body-lg` | 16 px / 400, line height 1.625 | Message text |
| `body-md` | 14 px / 400 | Default interface text, table cells, inputs |
| `label-md` | 14 px / 500 | Field labels, buttons, nav links |
| `label-sm` | 12 px / 500 | Badges, table headers (uppercase), row actions |
| `caption` | 12 px / 400 | Timestamps, hints, file sizes |
| `overline` | 10 to 11 px / 500 to 600, uppercase, letter spacing 0.14 to 0.2em | Sign-in field labels, wizard eyebrow and step counter |
| `counter` | 16 px, line height 1 | Reaction and thread counts |
| `timer` | 24 px monospace | Recording timer |

Small uppercase labels with wide tracking are a recurring pattern: field labels on sign-in, site names in link previews, the author of a quoted reply, table headers, the "Direct messages" section title.

## Layout

Spacing follows a 4 px scale: 4, 8, 12, 16, 20, 24. Gaps inside components are 4 to 12 px. Panels and cards use 16 to 24 px of padding.

- **Chat:** a full-height row of columns.
  1. Workspace rail, 64 px: round workspace buttons stacked from the top, the user's avatar at the bottom.
  2. Channel sidebar, 192 px: workspace name, "create channel" button, channel groups, direct messages.
  3. Message column, flexible: channel title, scrolling message list with 16 px padding and 8 px between bubbles, composer pinned to the bottom. Bubbles are at most 36em wide. Other people's messages align left, your own align right.
  4. Thread panel, 30% of the width, shown only when a thread is open.
- **Admin:** 224 px sidebar with the brand and navigation, then a content area with 24 px padding. Each page has a header row (title and subtitle on the left, the main action on the right) above a table or a column of cards. Settings forms are at most 672 px wide.
- **Profile:** a top bar with a back link, then one centered column 672 px wide with stacked cards 24 px apart.
- **Dialogs:** centered, 90% of the viewport width up to 360 to 520 px (video recorder 720 px), at most 85% of the viewport height.
- **Sign-in:** one card, 420 px wide, centered on the page, with a small footer below.
- **Install wizard:** one card, 980 px wide, split into a 310 px left pane and a form pane. This is the only responsive screen: under 768 px it becomes one column and the stepper becomes a row of three icons.

## Elevation & Depth

Most separation is done with surface steps and 1 px borders. Shadows are dark blue-black, soft and mostly downward.

| Shadow | Value | Use |
|---|---|---|
| `shadow-surface` | `0 8px 24px rgba(2, 8, 23, 0.35)` | Message bubbles, composer |
| `shadow-popover` | `0 6px 16px rgba(2, 8, 23, 0.4)` | Floating message toolbar |
| `shadow-picker` | `0 24px 70px rgba(3, 8, 23, 0.5)` | Emoji picker |
| `shadow-panel-edge` | `inset 1px 0 0 rgba(129, 140, 248, 0.08)` | Faint indigo line on the left edge of the thread panel |
| Dialog | `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)` | Gray dialogs |
| Card | `0 25px 50px -12px rgba(0, 0, 0, 0.4)` | Sign-in card, wizard shell |

- Dialogs sit on a black overlay at 75% opacity. The fullscreen media viewer uses 90%.
- Sign-in and wizard buttons carry a soft colored glow of their own hue (indigo or emerald at 15 to 20% opacity).
- Admin and profile are flat: borders only, no shadows on cards or tables.

## Shapes

| Radius | Use |
|---|---|
| 4 px (`sm`) | Inputs, buttons inside dialogs, channel list items, attachment thumbnails |
| 6 px (`md`) | Dialogs, page-level buttons, nav links, toolbar buttons, settings cards |
| 8 px (`lg`) | Tables, profile cards, the message toolbar, images in link previews |
| 12 px (`xl`) | Send button, link previews, file attachments, images and video, wizard fields and buttons |
| 16 px (`2xl`) | Message bubbles, composer, audio player, sign-in fields and button |
| 21.6 px (`picker`) | Emoji picker |
| 28 px (`card`) | Sign-in card, wizard shell |
| Full | Avatars, workspace buttons, reaction chips, thread button, badges, play buttons |

Avatars are always circles, in every size (40 px in messages and the rail, 48 px in a reply preview, 64 px on the profile, 96 px in the avatar editor).

## Components

Icons are Lucide outline icons. Sizes: 16 px in toolbars and buttons, 18 px in chips and play buttons, 20 px in the composer and thread header. Small action icons in the chat (message toolbar, send, close and delete buttons) use a heavy stroke (3); other icons use the default (2).

### Chat

- **Message bubble.** `surface` fill, 1 px `border`, 16 px radius, 16 px padding, `shadow-surface`. Inside: a 40 px avatar, then a column 12 px to the right.
  - Header row: the author's name (600, in their user color), the time on the far right (12 px, `text-muted`), an italic "edited" label when it applies.
  - Text: 16 px, `text-body`, line height 1.625.
  - Reply quote, when the message answers another: `surface-sunken` fill, 2 px indigo 400 bar on the left, 12 px `text-secondary` text, 6 px radius.
  - Below the text: attachments, link previews, then a row of reaction chips, the add-reaction button and the thread button.
  - Your own message: `surface-own` fill, `border-strong` border, aligned right.
- **Message toolbar.** Appears above the top right corner of a bubble on hover or keyboard focus. `surface-sunken` fill, `border-strong` border, 8 px radius, 4 px padding, `shadow-popover`. Buttons are 28 px squares with 16 px icons (reply, edit, delete), `text-muted`; hover gives a `surface-hover` fill and `accent-text` icon. Delete turns `danger-text` on hover.
- **Reaction chip.** A pill 36 px tall, at least 64 px wide, no fill until hovered (`surface-hover`). An 18 px emoji and a 16 px count in `accent-counter`. Focus: 2 px `focus` outline with a 2 px offset.
- **Add-reaction button.** A 36 px circle with a smiley-plus icon in `text-dim`. Hover and open: `accent-text`.
- **Thread button.** The same pill as a reaction, filled `#111a30`, with a speech-bubble icon and a count, `accent-text`. A thread with no replies is transparent and `text-dim` until hovered.
- **Composer.** A 16 px radius box filled `#141c33` with a 1 px `border` and `shadow-surface`, 12 px from the edges of the column. The border becomes `border-hover` while the field has focus. Left to right: attach, voice and video icons (20 px, `text-muted`, `accent-text` on hover), the text field, the send button.
  - Send button: 40 px, 12 px radius, indigo 500 fill, white arrow. Hover: indigo 400. Disabled: `border` fill with a `text-dim` icon. While editing a message the arrow becomes a check mark.
  - Editing banner above the field: dark yellow wash, 2 px yellow bar on the left, yellow 300 text.
  - Reply preview above the field: a 48 px avatar and a quote block (`#182036`, 2 px indigo 400 bar) with the author in small bold uppercase `accent-text` and one line of italic text, plus a close icon.
  - Attachment thumbnails: 100 px squares, 4 px radius, on gray 900. A red 20 px delete button appears on hover. Upload progress is a thin indigo 500 bar on a gray 600 track.
- **Link preview.** A block filled `#101830`, 1 px `border`, 12 px radius, 16 px padding. Site name in small bold uppercase `accent-text`, title in white 600, description in 14 px `#8b93b0`, an image with an 8 px radius. Hover: `border-hover`.
- **File attachment.** An inline card filled `#1b2440`, border `#28345a`, 12 px radius. A 40 px icon tile (`#232e52`, 8 px radius, `accent-text` icon), the file name in 14 px white 600, the size in 12 px `#8b93b0`. Hover: `border-hover` and a slightly lighter fill.
- **Images and video.** Up to 320 px tall, 12 px radius. A click opens the fullscreen viewer: 90% black, media centered, a 40 px round close button in the top right corner.
- **Audio player.** A 16 px radius card on slate 900 with a faint sky border. A 40 px round sky 500 play button, a 28 px tall waveform, the time in 12 px slate 400.
- **Emoji picker.** A popover up to 464 px wide filled `#1d2a44`, 21.6 px radius, `shadow-picker`.
  - Search field: 68 px tall, 16 px radius, `#071226` fill, a 24 px search icon, 21.6 px semibold text.
  - Category tabs: 36 px squares with 12 px radius and Lucide icons. The active tab is filled `#273653`.
  - Grid: 8 columns, 6 px gaps, 23 px emoji. A cell lifts 2 px and gets a `#273653` fill on hover.
- **Emoji suggestions** (typing `:name`). A list popup on gray 900 with a gray 600 border and 8 px radius. Rows are 14 px with the emoji, its name and its code on the right in gray 500. The active row has an indigo 600 wash at 40%.
- **Thread panel.** `surface-panel` fill, 1 px `#2a3557` border on the left. Header: a 20 px `accent-text` icon, the title in 18 px bold white, a close icon on the right, a 1 px `border` line below. The body is a message list and a composer like the main column.
- **Scroll button.** A round indigo 600 button with an indigo 300 border, half transparent until hovered, floating over the message list.
- **Channel sidebar.** Background `#17202d`, 1 px gray 700 border on the right, 16 px padding.
  - Workspace name: a chip on gray 800 with a gray 700 border, 14 px white 600.
  - "Create channel" and "New message": full-width indigo 600 buttons with an indigo 500 border, 6 px radius, 14 px white 500, starting with a plus sign.
  - Group title: 14 px gray 300, 600. Section title ("Direct messages"): 12 px gray 500, uppercase.
  - Channel item: gray 400 text, 4 px radius, gray 700 fill on hover. The active channel is bold white with no fill.
- **Workspace rail.** Gray 800. Workspace buttons are 40 px gray 700 circles showing the workspace's initial; hover and active are gray 500. A plus button creates a workspace. The user's avatar at the bottom opens a small menu: gray 800, gray 700 border, 6 px radius, with the user's name, role and links.
- **Recorder dialogs** (voice and video). A dialog 500 px wide (720 px for video) with 25 px padding and a 17 px title. A waveform or video preview, a centered monospace timer, a status line with a pulsing red dot while recording and a yellow dot when paused. Buttons are indigo 500 with bold white text and a 4 px radius.

### Admin, profile and dialogs

- **Primary button.** Indigo 600 fill, white 14 px text, 500 weight. Hover: indigo 500. Disabled: gray 600 fill, gray 400 text. Page-level buttons have a 6 px radius and 8 × 16 px padding. Inside dialogs they have a 4 px radius and 6 × 16 px padding.
- **Text button** (cancel). No fill, gray 300 text, white on hover.
- **Danger button.** Red 600 fill, white text. Hover: red 500. Used for the confirm action in delete dialogs.
- **Input, select.** Gray 700 fill, 1 px gray 600 border, 4 px radius, white text, 8 × 12 px padding. Focus: a 2 px indigo 500 ring. Label above: 14 px gray 300, 500. Hint below: 12 px gray 500. Error below: 14 px red 400.
- **Checkbox.** Gray 700 box with a gray 500 border, indigo 500 when checked.
- **Dialog.** Gray 800, 6 px radius, 20 px padding, white text, over the 75% black overlay. Title 18 px 600, optional description 14 px gray 300 or 400, fields 12 to 16 px apart, buttons right-aligned 8 px apart with cancel first.
- **Confirm dialog.** The same dialog, 440 px wide, with a red confirm button. Every destructive action goes through it.
- **Message banner.** 4 px radius, 12 × 8 px padding, 14 px text: a 10% wash, a 40% border and light text of the status hue (red for errors, emerald for success, amber for notes).
- **Admin sidebar.** Gray 950 with a gray 700 border on the right. Brand name in 18 px 600 at the top, above a divider. Nav links are 14 px gray 300 with a 16 px icon and a 6 px radius. Hover and active: gray 800 fill, white text.
- **Page header.** Title 24 px white 600, subtitle 14 px gray 400, the main action on the right.
- **Table.** A wrapper with an 8 px radius and a gray 700 border. Header row: gray 800, 12 px uppercase gray 400. Cells: 12 × 16 px padding, 14 px. Rows: gray 900 at 60%, a gray 700 line above, gray 800 on hover. The main cell is white 500 with a 12 px gray 500 line under it.
  - Row actions are small text buttons: edit in indigo 300, delete in red 400. Hover adds a 20% wash of the same hue.
  - Empty state: a dashed gray 700 border, 8 px radius, centered gray 400 text.
- **Badge.** A pill with 12 px text, 500 weight, 2 × 8 px padding. Positive: emerald 300 on a 20% emerald wash. Warning: amber 300 on a 20% amber wash. Danger: red 300 on a 20% red wash. Neutral: gray 300 on gray 700.
- **Card.** Profile cards: gray 800 at 60%, gray 700 border, 8 px radius, 20 px padding, a 16 px white 600 title. Settings sections: solid gray 800, 6 px radius.
- **Avatar editor.** A 96 px round preview with a dashed border until an image is set. The crop dialog shows a 240 px square with everything outside a circle dimmed, and a zoom slider.

### Sign-in

- **Card.** 420 px wide, 28 px radius, `#131a2b` fill, a white border at 5%, 32 px padding, a deep black shadow.
- **Title and subtitle.** 26 px white 600 with tight tracking, then 14 px gray 400.
- **Field.** Label in 11 px uppercase gray 500 with 0.14em tracking. The field is a 16 px radius box on `#1a2236` with a white border at 10%, a gray 500 icon on the left (at sign, lock, person) and 14 px white text. Focus: an indigo border and a soft indigo ring. Error: a red border, with 12 px red 400 text below.
- **Submit button.** Full width, 16 px radius, the lavender gradient, 14 px dark text in 600, a soft indigo glow. Disabled: 50% opacity.
- **Links.** Indigo 400, indigo 300 on hover. "Forgot password" is 11 px uppercase.
- **Social row.** Three 52 px tall buttons with a 16 px radius. They are shown disabled.
- **Alert.** 16 px radius, 14 px text, a 10% wash and a 30% border in red or emerald.

### Install wizard

- **Shell.** 980 px wide, 28 px radius, a white border at 10%, a deep shadow, on a page with soft glows.
- **Left pane.** `#0d1424`, 32 px padding. The logo on a white 40 px tile with a 12 px radius next to the product name, a 10 px uppercase indigo eyebrow, a 30 px heading, a 14 px slate 400 intro, then the stepper.
- **Stepper.** Rows with a 36 px icon square (12 px radius), a 14 px title and a 12 px note. Active: a white 5% row fill and an indigo icon. Done: an emerald icon.
- **Form pane.** `#131b2d`, 40 px padding. On top, a step counter in 10 px uppercase next to a 4 px indigo progress bar. Each step starts with a 44 px icon tile, a 20 px title and a 14 px description.
- **Field.** 48 px tall, 12 px radius, `#0d1424` fill, a white border at 10%, 14 px white text, a 12 px slate 300 label above.
- **Choice card and toggle row.** 16 px radius rows with a white border at 10%, a 14 px title and a 12 px note. The toggle is a 44 × 24 px track, slate 700 when off and indigo 400 when on.
- **Buttons.** 44 px tall, 12 px radius, 14 px text in 500. Back: no fill, slate 400. Next: indigo 400 fill with near-black text, indigo 300 on hover. Install: emerald 400 fill with dark green text, 56 px tall, at least 224 px wide, grows slightly on hover.
- **Success state.** An 80 px emerald circle with a check icon above a 24 px title.
- **Loading screen.** `#090d18`, the logo on a white 48 px tile with a 16 px radius, an indigo 300 spinner, 14 px slate 400 text.

## Do's and Don'ts

- Do design dark screens only. There is no light theme.
- Do keep indigo as the single accent. Use red, emerald and amber for status only.
- Do make every avatar a circle.
- Do show status as a light text color on a transparent wash of the same hue, with a text label.
- Do put destructive actions behind a confirm dialog with a red confirm button and a plain text cancel button.
- Do use Lucide outline icons.
- Do leave room for longer text: every label also exists in Russian and Ukrainian.
- Do keep a visible focus state: a 2 px indigo outline or ring.
- Do match the area a screen belongs to (chat, gray, sign-in, wizard).
- Don't use the logo colors (orange `#ff5a36`, navy `#1b1b3a`) for buttons, links or other interface elements.
- Don't use pure black or white as a page or panel background. Black appears only behind media (video, the fullscreen viewer) and white only as text and behind the logo.
- Don't add gradients outside the sign-in button and the wizard background.
- Don't design a mobile layout for the chat. It does not have one.
- Don't mix the navy chat surfaces and the neutral grays inside one component.

## Logo

The Chatney logo is the "Talking C": a capital C drawn as a speech bubble, with two sound waves leaving its open side.

- **Colors:** a white C with navy `#1b1b3a` waves on an orange `#ff5a36` square tile.
- **The C:** one thick open arc with round ends, opening to the right. The stroke is a little under a third of the letter's height.
- **The tail:** a small triangle at the lower left of the C with slightly rounded corners, in the same white. It turns the letter into a speech bubble.
- **The waves:** two thin concentric arcs with round ends to the right of the opening, the outer one larger. Their stroke is a fifth of the C's stroke.
- **The tile:** a square. The mark fills about 80% of it, which leaves a margin of about a tenth of the tile on each side.

Source: `design/talking-c-variants.svg`, group `waves-solid-white-on-orange`. The other pairings in that file, and the version with typing dots, were explorations and are not approved alternates. No minimum size, clear-space rule or rounded app-icon shape has been defined yet.

The app does not use this logo yet. The favicon, the loading screen and the install wizard still show an earlier mark (a blue C with three coral lines) on a white tile.

## Differences between areas

The same element is styled differently in different places today. Use the variant of the screen you are designing for.

| Element | Variants |
|---|---|
| Primary button | Admin, profile, most dialogs, sidebar buttons: indigo 600, hover indigo 500. Create channel and create workspace dialogs: blue 600, hover blue 700. Send button: indigo 500, hover indigo 400. Recorder dialogs: indigo 500, hover indigo 600, bold text. Sign-in: lavender gradient with dark text. Wizard: indigo 400 with dark text, and emerald 400 for "install". |
| Play button | Sky 500 circle in the audio player and the voice recorder. Nothing else in the product is sky blue. |
| Dialog | Gray 800 with a 6 px radius and 20 px padding for most. The recorder and file preview dialogs use a different container: 25 px padding, a 17 px title, and a background that follows the operating system (zinc 800 with light text in dark mode, zinc 200 with dark text in light mode). |
| Text field | Gray: gray 700 fill, 4 px radius. Sign-in: `#1a2236`, 16 px radius, icon on the left. Wizard: `#0d1424`, 12 px radius, 48 px tall. Composer and emoji search: borderless text inside a rounded container. |
| Focus state | Chat: 2 px outline `#8f96ff`. Forms: 2 px indigo 500 ring. Emoji picker: 2 px outline `#9aa6ff`. Sign-in and wizard: an indigo border plus a soft ring. |
| Avatar without an image | Messages: white initials on a color derived from the user id. Profile page: indigo 600. User menu in the rail: blue 500. |
| Error banner | Gray: red 500 wash and border, red 300 text, 4 px radius. Sign-in: the same with a 16 px radius. Wizard: rose instead of red, 12 px radius. |
| Sidebar | Chat channel sidebar: `#17202d`, 192 px. Workspace rail: gray 800, 64 px. Admin sidebar: gray 950, 224 px. |
| Message column vs. its frame | The message column and thread panel use the navy tokens. The rail and channel sidebar next to them use neutral grays. |
