import type { AttachmentFieldsFragment } from '@/graphql/generated/graphql';

export type AttachmentId = number;

export type AttachmentUploadMetadata = {
    width?: number;
    height?: number;
    duration?: number;
};

export type Attachment = AttachmentFieldsFragment;
