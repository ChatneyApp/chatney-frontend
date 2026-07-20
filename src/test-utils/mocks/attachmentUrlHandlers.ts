import { http, HttpResponse } from 'msw';
import {
    samplePlaceholderAudioUrl,
    samplePlaceholderGifUrl,
    samplePlaceholderImageUrl,
    samplePlaceholderVideoUrl,
} from '@/test-utils/fixtures/attachments';

const CONTENT_TYPE_BY_EXTENSION: Record<string, string> = {
    '.gif': 'image/gif',
    '.mp4': 'video/mp4',
    '.mp3': 'audio/mpeg',
};

const resolveSampleUrl = (pathname: string) => {
    if (pathname.endsWith('.gif')) {
        return samplePlaceholderGifUrl;
    }
    if (pathname.endsWith('.mp4')) {
        return samplePlaceholderVideoUrl;
    }
    if (pathname.endsWith('.mp3')) {
        return samplePlaceholderAudioUrl;
    }
    return samplePlaceholderImageUrl;
};

/**
 * MessageAttachmentComponent/MessageEditorAttachment build their display URL from a hardcoded
 * `http://localhost:9000/chatney/...` base (real local MinIO endpoint in dev — see
 * STORYBOOK_COVERAGE.md caveats), which nothing is listening on inside Storybook. Rather than
 * running a real server on port 9000 (risking a clash with an actual local MinIO instance), this
 * intercepts those specific requests at the browser network layer.
 *
 * It fetches and re-serves real sample bytes (rather than returning an HTTP redirect) so `<img>`,
 * `<video>`, and `<audio>` elements all see a normal 200 response straight from the requested
 * URL — a redirect works for `<img>` but is unreliable for media elements that issue Range
 * requests through the service worker. All sample hosts are CORS-permissive so the body can
 * actually be read here.
 */
export const attachmentUrlHandlers = [
    http.get('http://localhost:9000/chatney/*', async ({ request }) => {
        const { pathname } = new URL(request.url);
        const sampleUrl = resolveSampleUrl(pathname);
        const extension = Object.keys(CONTENT_TYPE_BY_EXTENSION).find(ext => pathname.endsWith(ext));

        const response = await fetch(sampleUrl);
        if (!response.ok) {
            return new HttpResponse(null, { status: response.status });
        }

        const body = await response.arrayBuffer();
        return new HttpResponse(body, {
            status: 200,
            headers: {
                'Content-Type': response.headers.get('Content-Type')
                    ?? (extension ? CONTENT_TYPE_BY_EXTENSION[extension] : 'image/jpeg'),
            },
        });
    }),
];
