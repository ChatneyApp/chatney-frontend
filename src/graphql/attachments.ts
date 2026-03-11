import { ApolloClient, gql, NormalizedCacheObject } from '@apollo/client';

type UploadFileResponse = {
    attachments?: {
        upload?: {
            attachmentId: string;
            s3Url: string;
        };
    };
};

const UPLOAD_FILE_MUTATION = gql`
    mutation UploadFile($file: Upload!) {
        attachments {
            upload(file: $file) {
                attachmentId
                s3Url
            }
        }
    }
`;

export const uploadFile = async (
    client: ApolloClient<NormalizedCacheObject>,
    data: Blob,
    fileName: string,
    mimeType: string
): Promise<{ attachmentId: string; s3Url: string }> => {
    const file = new File([data], fileName, {
        type: mimeType || data.type || 'application/octet-stream',
    });

    try {
        const response = await client.mutate<UploadFileResponse>({
            mutation: UPLOAD_FILE_MUTATION,
            variables: {
                file,
            },
        });

        const result = response.data?.attachments?.upload;

        if (!result) {
            throw new Error('Upload response does not contain attachments.upload');
        }

        return {
            attachmentId: result.attachmentId,
            s3Url: result.s3Url,
        };
    } catch (error) {
        throw new Error(`File upload failed: ${(error as Error).message}`);
    }
};
