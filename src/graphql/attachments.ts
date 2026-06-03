import { ApolloClient, gql } from '@apollo/client';
import { Attachment, AttachmentUploadMetadata } from '@/types/attachments';
import { userAuthTokenName } from '@/infra/consts';

type UploadFileResponse = {
    attachments?: {
        upload?: Attachment;
    };
};

const uploadFileMutationText = `
    mutation UploadFile($file: Upload!, $asFile: Boolean!, $width: Int, $height: Int, $duration: Int) {
        attachments {
            upload(file: $file, asFile: $asFile, width: $width, height: $height, duration: $duration) {
                id
                userId
                urlPath
                originalFileName
                extension
                mimeType
                size
                type
                asFile
                width
                height
                duration
                createdAt
                updatedAt
            }
        }
    }
`;

const UPLOAD_FILE_MUTATION = gql(uploadFileMutationText);

export const uploadFile = async (
    client: ApolloClient,
    data: Blob,
    fileName: string,
    mimeType: string,
    asFile = false,
    metadata?: AttachmentUploadMetadata,
): Promise<Attachment> => {
    const file = new File([data], fileName, {
        type: mimeType || data.type || 'application/octet-stream',
    });

    try {
        const response = await client.mutate<UploadFileResponse>({
            mutation: UPLOAD_FILE_MUTATION,
            variables: {
                file,
                asFile,
                width: metadata?.width,
                height: metadata?.height,
                duration: metadata?.duration,
            },
        });

        const result = response.data?.attachments?.upload;

        if (!result) {
            throw new Error('Upload response does not contain attachments.upload');
        }

        return result;
    } catch (error) {
        throw new Error(`File upload failed: ${(error as Error).message}`);
    }
};

type GraphqlUploadResponse = {
    data?: UploadFileResponse;
    errors?: { message: string }[];
};

export const uploadFileWithProgress = async (
    data: Blob,
    fileName: string,
    mimeType: string,
    asFile = false,
    metadata?: AttachmentUploadMetadata,
    onProgress?: (progress: number) => void,
    signal?: AbortSignal,
): Promise<Attachment> => {
    const file = new File([data], fileName, {
        type: mimeType || data.type || 'application/octet-stream',
    });
    const formData = new FormData();
    formData.append('operations', JSON.stringify({
        query: uploadFileMutationText,
        variables: {
            file: null,
            asFile,
            width: metadata?.width,
            height: metadata?.height,
            duration: metadata?.duration,
        },
    }));
    formData.append('map', JSON.stringify({
        0: ['variables.file'],
    }));
    formData.append('0', file);

    const response = await new Promise<GraphqlUploadResponse>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', import.meta.env.VITE_API_URL);
        xhr.setRequestHeader('GraphQL-preflight', '1');

        const userToken = localStorage.getItem(userAuthTokenName);
        if (userToken) {
            xhr.setRequestHeader('Authorization', `Bearer ${userToken}`);
        }

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                onProgress?.(event.loaded / event.total);
            }
        };
        xhr.onload = () => {
            if (xhr.status < 200 || xhr.status >= 300) {
                reject(new Error(`Upload failed with status ${xhr.status}`));
                return;
            }

            try {
                resolve(JSON.parse(xhr.responseText) as GraphqlUploadResponse);
            } catch (error) {
                reject(error);
            }
        };
        xhr.onerror = () => reject(new Error('Upload failed due to a network error'));
        xhr.onabort = () => reject(new DOMException('Upload aborted', 'AbortError'));

        signal?.addEventListener('abort', () => xhr.abort(), { once: true });
        xhr.send(formData);
    });

    if (response.errors?.length) {
        throw new Error(response.errors.map(error => error.message).join('\n'));
    }

    const result = response.data?.attachments?.upload;
    if (!result) {
        throw new Error('Upload response does not contain attachments.upload');
    }

    onProgress?.(1);

    return result;
};
