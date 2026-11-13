# Future features

What Chatney's chat lacks compared with a typical messenger (Telegram, Discord, Slack, WhatsApp).

- The list was derived from the frontend only. The backend was not checked, so it may already support some of this.
- Nothing here is committed work or ordered by date. It is a backlog of candidates.
- `DESIGN_GUIDES.md` section 11 tells the designer not to draw these as working features. Section 12 reserves space in the layouts for twelve of them.

## Do first

People notice the absence of these within minutes:

1. Unread counts
2. Notifications
3. @mentions
4. Search
5. Text formatting
6. Multi-file, paste and drag-and-drop upload
7. Typing indicator and presence
8. Profile card

## Staying up to date

- **Unread counts** on channels, direct messages and workspaces, with a separate badge for mentions.
- **"New messages" divider** and a jump to the first unread message.
- **Mark as read / unread.**
- **Notifications:** desktop and push, sound, and a count in the tab title and favicon.
- **Notification level per channel** (everything, mentions only, nothing) and mute for a set time.
- **Do not disturb** with a schedule.

## Presence and delivery

- **Online / away / offline** and "last seen".
- **Custom status:** an emoji and text that expires.
- **Typing indicator.**
- **Read receipts:** ticks in direct messages, "seen by" in groups.
- **Delivery state of your own message:** sending, sent, failed with retry.

## Writing a message

- **Formatting:** bold, italic, strikethrough, inline code, code blocks, quotes, lists and spoilers, by toolbar and by markdown shortcuts.
- **Mentions:** `@user`, `@channel` / `@here`, role mentions and `#channel` links, with autocomplete.
- **Uploads:** several files at once, drag-and-drop, paste from the clipboard, and an album grid for several images.
- **Drafts** kept per channel.
- **Scheduled and silent send.**
- **Up arrow** to edit your last message.
- **Slash commands.**
- **Polls.**
- **Emoji extras:** GIF picker, stickers, custom emoji, skin tones, recently used.
- **Location and contact sharing.**

## Acting on a message

- **Copy text** and **copy link to message**.
- **Forward** to another chat.
- **Pin**, with a pinned-messages panel.
- **Save / bookmark** and "remind me later".
- **Select several messages** to delete or forward together.
- **Jump to the original** from a reply quote. Today the quote is plain text.
- **See who reacted.** Today a reaction only has a count.
- **Edit history.**
- **Report a message.**
- **Voice messages:** playback speed and a transcript.
- **Translate a message.**

## Finding things

- **Message search** with filters: from, in, has file, date.
- **Quick switcher** (Ctrl+K) for channels and people.
- **Jump to a date.**
- **Media, files and links** browser for a channel.
- **Activity inbox:** all your mentions and the threads you follow.
- **Browse and join channels.**

## Channels and people

- **Channel details panel:** topic, description, member list.
- **Membership:** invite, add and remove members, join, leave, invite links.
- **Rename, archive or delete** a channel from the chat. Today this is only in the admin area.
- **Sidebar control:** favourite channels, collapse groups, hide a direct message.
- **Group direct messages:** add people later, give the group a name.
- **Profile card** from an avatar or name: bio, role, local time, "Message".
- **Block a user.**
- **Moderation:** slow mode, timeouts, a reports queue, an audit log.
- **Disappearing messages.**

## Threads

- **"Also send to channel"** when replying in a thread.
- **Follow / unfollow** a thread, with unread state.
- **Repliers' avatars and last reply time** on the thread button.

## Calls

- **Voice and video calls**, one-to-one and group, with screen sharing.
- **Drop-in rooms** such as Discord voice channels or Slack huddles.

## Account and settings

- **Settings page:** language, notifications, message density, 12/24-hour time, what Enter does.
- **Security:** active sessions with "log out everywhere", two-factor sign-in, change email, delete account.
- **Working social sign-in or SSO.**
- **Keyboard shortcuts help.**

## Platform

- **Installable app (PWA)** with cached history and an offline outbox.
- **Bots, incoming webhooks and integrations.**
- **Data export.**
