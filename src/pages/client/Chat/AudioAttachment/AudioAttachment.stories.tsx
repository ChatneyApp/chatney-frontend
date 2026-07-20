import type { Meta, StoryObj } from '@storybook/react-vite';
import { AudioAttachment } from './AudioAttachment';
import { mockAudioAttachment, samplePlaceholderAudioUrl } from '@/test-utils/fixtures/attachments';

/**
 * AudioAttachment fetches `attachmentUrl` and decodes it via the Web Audio API to draw a
 * waveform. It degrades gracefully (falls back to an empty/flat waveform) if the fetch or
 * decode fails, so this still renders sensibly without network access — see
 * STORYBOOK_COVERAGE.md caveats.
 */
const meta: Meta<typeof AudioAttachment> = {
    title: 'pages/client/Chat/AudioAttachment',
    component: AudioAttachment,
};
export default meta;

type Story = StoryObj<typeof AudioAttachment>;

/** An audio message with a real sample clip, so the waveform decodes successfully. */
export const Default: Story = {
    args: {
        attachment: mockAudioAttachment,
        attachmentUrl: samplePlaceholderAudioUrl,
    },
};

/** A broken/unreachable URL — the waveform falls back to its empty state instead of throwing. */
export const FailedToLoad: Story = {
    // Opt out of the global attachmentUrlHandlers mock (see attachmentUrlHandlers.ts) so this URL genuinely fails to load.
    parameters: {
        msw: { handlers: [] },
    },
    args: {
        attachment: mockAudioAttachment,
        attachmentUrl: 'http://localhost:9000/chatney/does-not-exist.mp3',
    },
};
