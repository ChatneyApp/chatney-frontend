import { UserId } from '@/types/users';

export type AttachmentId = number;

export type Attachment = {
    id: AttachmentId;
    userId: UserId;
    urlPath: string;
    originalFileName: string;
    extension: string;
    mimeType: string;
    size: number;
    type: 'image' | 'gif' | 'video' | 'audio' | 'binary';
    asFile: boolean;
    createdAt: Date;
    updatedAt: Date;
}
