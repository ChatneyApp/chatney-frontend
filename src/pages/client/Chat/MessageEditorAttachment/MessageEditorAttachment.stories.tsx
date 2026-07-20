import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { MessageEditorAttachment } from './MessageEditorAttachment';
import { mockAudioAttachment, mockImageAttachment } from '@/test-utils/fixtures/attachments';

/**
 * Only the "uploaded" prop variant is covered here. The "pending" variant (new file being
 * uploaded) calls the real `uploadFileWithProgress` via raw XHR in a `useEffect` on mount —
 * without a module-mocking mechanism (no addon-vitest in this install, see
 * STORYBOOK_COVERAGE.md) that XHR can't be intercepted, so it was left out rather than shipping
 * a story that always errors against a real endpoint.
 */
const meta: Meta<typeof MessageEditorAttachment> = {
    title: 'pages/client/Chat/MessageEditorAttachment',
    component: MessageEditorAttachment,
};
export default meta;

type Story = StoryObj<typeof MessageEditorAttachment>;

/** An already-uploaded image attachment shown in the composer. */
export const UploadedImage: Story = {
    args: {
        attachment: mockImageAttachment,
        onDelete: action('onDelete'),
    },
};

/** An already-uploaded audio attachment shown in the composer. */
export const UploadedAudio: Story = {
    args: {
        attachment: mockAudioAttachment,
        onDelete: action('onDelete'),
    },
};
