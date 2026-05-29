import { ApolloClient, gql } from '@apollo/client';
import { Attachment } from '@/types/attachments';
import { userAuthTokenName } from '@/infra/consts';

type UploadFileResponse = {
    attachments?: {
        upload?: Attachment;
    };
};

const uploadFileMutationText = `
    mutation UploadFile($file: Upload!, $asFile: Boolean!) {
        attachments {
            upload(file: $file, asFile: $asFile) {
                id
                userId
                urlPath
                originalFileName
                extension
                mimeType
                size
                type
                asFile
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
