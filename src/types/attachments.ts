import { UserId } from '@/types/users';

export type AttachmentId = number;

export type AttachmentUploadMetadata = {
    width?: number;
    height?: number;
    duration?: number;
};

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
    width: number | null;
    height: number | null;
    duration: number | null;
    createdAt: Date;
    updatedAt: Date;
}
