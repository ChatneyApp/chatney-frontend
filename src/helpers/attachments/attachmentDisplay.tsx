import { File as FileIcon, Film, Image as ImageIcon, Music } from 'lucide-react';

import { Attachment } from '@/types/attachments';

type AttachmentType = Attachment['type'];

type IconOptions = {
    className?: string;
    size?: number;
};

export const getAttachmentType = (mimeType: string): AttachmentType => {
    if (mimeType === 'image/gif') {
        return 'gif';
    }

    if (mimeType.startsWith('image/')) {
        return 'image';
    }

    if (mimeType.startsWith('video/')) {
        return 'video';
    }

    if (mimeType.startsWith('audio/')) {
        return 'audio';
    }

    return 'binary';
};

export const getFileIcon = (attachmentType: AttachmentType, { className, size = 18 }: IconOptions = {}) => {
    switch (attachmentType) {
        case 'image':
        case 'gif':
            return <ImageIcon className={className} size={size} />;
        case 'video':
            return <Film className={className} size={size} />;
        case 'audio':
            return <Music className={className} size={size} />;
        case 'binary':
            return <FileIcon className={className} size={size} />;
    }
};
