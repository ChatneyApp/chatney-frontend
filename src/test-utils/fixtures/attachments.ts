import { Attachment } from '@/types/attachments';
import { mockUserId1 } from './users';

/**
 * `urlPath` values are placeholders — MessageAttachmentComponent/MessageEditorAttachment build
 * their display URL via a hardcoded `http://localhost:9000/chatney/${urlPath}` (see
 * STORYBOOK_COVERAGE.md caveats). `src/test-utils/mocks/attachmentUrlHandlers.ts` intercepts
 * that host in Storybook and serves real sample bytes based on the file extension, so previews
 * render normally despite the fake path.
 */
const now = new Date('2026-01-15T10:00:00Z');

export const mockImageAttachment: Attachment = {
    id: 1,
    userId: mockUserId1,
    urlPath: 'attachments/sample-image.jpg',
    originalFileName: 'sunset.jpg',
    extension: 'jpg',
    mimeType: 'image/jpeg',
    size: 245_000,
    type: 'image',
    asFile: false,
    width: 1200,
    height: 800,
    duration: null,
    createdAt: now,
    updatedAt: now,
};

export const mockGifAttachment: Attachment = {
    ...mockImageAttachment,
    id: 2,
    urlPath: 'attachments/sample.gif',
    originalFileName: 'reaction.gif',
    extension: 'gif',
    mimeType: 'image/gif',
    type: 'gif',
};

export const mockVideoAttachment: Attachment = {
    id: 3,
    userId: mockUserId1,
    urlPath: 'attachments/sample-video.mp4',
    originalFileName: 'demo.mp4',
    extension: 'mp4',
    mimeType: 'video/mp4',
    size: 3_400_000,
    type: 'video',
    asFile: false,
    width: 1280,
    height: 720,
    duration: 12,
    createdAt: now,
    updatedAt: now,
};

export const mockAudioAttachment: Attachment = {
    id: 4,
    userId: mockUserId1,
    urlPath: 'attachments/sample-audio.mp3',
    originalFileName: 'voice-note.mp3',
    extension: 'mp3',
    mimeType: 'audio/mpeg',
    size: 180_000,
    type: 'audio',
    asFile: false,
    width: null,
    height: null,
    duration: 8,
    createdAt: now,
    updatedAt: now,
};

export const mockBinaryAttachment: Attachment = {
    id: 5,
    userId: mockUserId1,
    urlPath: 'attachments/report.pdf',
    originalFileName: 'quarterly-report.pdf',
    extension: 'pdf',
    mimeType: 'application/pdf',
    size: 512_000,
    type: 'binary',
    asFile: true,
    width: null,
    height: null,
    duration: null,
    createdAt: now,
    updatedAt: now,
};

/**
 * Publicly hosted sample media, for components that take an explicit `attachmentUrl` prop
 * rather than deriving it from `urlPath`, and for `attachmentUrlHandlers.ts` to proxy real bytes
 * through. All four hosts are known to serve permissive CORS headers, which the MSW handler
 * needs since it reads the response body rather than just redirecting to it.
 */
export const samplePlaceholderImageUrl = 'https://picsum.photos/id/1015/800/600';
export const samplePlaceholderGifUrl = 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif';
export const samplePlaceholderVideoUrl = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
export const samplePlaceholderAudioUrl = 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3';
