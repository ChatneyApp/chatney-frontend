import { UserId } from '@/types/users';

export type AttachmentId = number;

export type Attachment = {
    id: AttachmentId;
    userId: UserId;
    urlPath: string;
    originalFileName: string;
    extension: string;
    mimeType: string;
    type: 'image' | 'gif' | 'video' | 'audio' | 'binary';
    createdAt: Date;
    updatedAt: Date;
}

export type UploadedAttachment = {
    attachmentId: AttachmentId;
    s3Url: string;
    mimeType: string;
}
