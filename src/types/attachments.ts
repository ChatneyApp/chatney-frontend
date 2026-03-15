export type AttachmentId = string;

export type Attachment = {
    id: AttachmentId;
}

export type UploadedAttachment = {
    attachmentId: AttachmentId;
    s3Url: string;
}
