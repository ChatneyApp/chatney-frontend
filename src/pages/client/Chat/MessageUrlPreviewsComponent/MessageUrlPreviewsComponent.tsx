import { UrlPreview } from '@/types/messages';
import { MessageUrlPreviewComponent } from './MessageUrlPreviewComponent';

export const MessageUrlPreviewsComponent = ({ urlPreviews }: { urlPreviews: UrlPreview[] }) => {
    if (!urlPreviews || urlPreviews.length === 0) {
        return null;
    }
    return (
        <div className="mt-2 space-y-2">
            {urlPreviews.map(preview => (
                <MessageUrlPreviewComponent
                    key={preview.id}
                    preview={preview}
                />
            ))}
        </div>
    );
};
