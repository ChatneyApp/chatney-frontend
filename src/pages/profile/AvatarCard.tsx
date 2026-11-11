import { ChangeEvent, useRef, useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { useTranslation } from 'react-i18next';

import { ConfirmDialog } from '@/components/ConfirmDialog';
import { CLEAR_AVATAR, UPLOAD_AVATAR } from '@/graphql/profile';
import { getAvatarSrc } from '@/helpers/avatar';
import { getGraphQLErrorCode, INVALID_AVATAR } from '@/helpers/graphqlErrors';

import { AvatarCropDialog } from './AvatarCropDialog';
import styles from './AvatarCard.module.css';

type Props = {
    /** Image `src` of the current avatar, or null if the user has none. */
    avatarSrc: string | null;
    /** Called with the new image `src` after the avatar was uploaded or removed on the server. */
    onChange: (avatarSrc: string | null) => void;
};

/** Shows the current user's avatar and lets them upload a new one or remove it. Saves on its own, apart from the profile form. */
export function AvatarCard({ avatarSrc, onChange }: Props) {
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [pickedFile, setPickedFile] = useState<File | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
    const [removeError, setRemoveError] = useState<string | null>(null);

    const [uploadAvatar, { loading: uploading, reset: resetUpload }] = useMutation(UPLOAD_AVATAR);
    const [clearAvatar, { loading: removing }] = useMutation(CLEAR_AVATAR);

    // Also drops the failed upload, so the next pick starts from scratch.
    const closeCropDialog = () => {
        setPickedFile(null);
        setUploadError(null);
        resetUpload();
    };

    const handleFilePicked = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        // lets the same file be picked again
        event.target.value = '';
        closeCropDialog();
        setPickedFile(file);
    };

    const handleUpload = async (avatar: Blob) => {
        setUploadError(null);

        try {
            const { data } = await uploadAvatar({
                variables: { file: new File([avatar], 'avatar.png', { type: 'image/png' }) },
            });
            const src = getAvatarSrc(data?.users.uploadAvatar.avatarUrl);

            // The storage path stays the same between uploads, so the browser would show the cached image.
            onChange(src && `${src}?v=${Date.now()}`);
            closeCropDialog();
        } catch (error) {
            console.error(error);
            setUploadError(getGraphQLErrorCode(error) === INVALID_AVATAR
                ? t('profile.avatar.errors.invalid')
                : t('profile.avatar.errors.uploadFailed'));
        }
    };

    const handleRemove = async () => {
        setRemoveError(null);

        try {
            await clearAvatar();
            onChange(null);
            setRemoveDialogOpen(false);
        } catch {
            setRemoveError(t('profile.avatar.errors.removeFailed'));
        }
    };

    return (
        <section className={styles.card}>
            <h2 className={styles.cardTitle}>{t('profile.avatar.title')}</h2>
            <div className={styles.content}>
                <div className={styles.preview}>
                    {avatarSrc ? (
                        <img src={avatarSrc} alt={t('profile.avatar.alt')} className={styles.previewImage} />
                    ) : (
                        <span className={styles.noImage}>{t('profile.avatar.noImage')}</span>
                    )}
                </div>
                <div className={styles.controls}>
                    <div className={styles.buttons}>
                        <button
                            type="button"
                            className={styles.uploadButton}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {avatarSrc ? t('profile.avatar.change') : t('profile.avatar.upload')}
                        </button>
                        {avatarSrc && (
                            <button
                                type="button"
                                className={styles.removeButton}
                                onClick={() => {
                                    setRemoveError(null);
                                    setRemoveDialogOpen(true);
                                }}
                            >
                                {t('profile.avatar.remove')}
                            </button>
                        )}
                    </div>
                    <span className={styles.hint}>{t('profile.avatar.hint')}</span>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className={styles.fileInput}
                    aria-label={t('profile.avatar.upload')}
                    tabIndex={-1}
                    onChange={handleFilePicked}
                />
            </div>

            <AvatarCropDialog
                file={pickedFile}
                onCancel={closeCropDialog}
                onConfirm={handleUpload}
                loading={uploading}
                error={uploadError}
            />
            <ConfirmDialog
                open={removeDialogOpen}
                onOpenChange={setRemoveDialogOpen}
                title={t('profile.avatar.removeDialog.title')}
                description={t('profile.avatar.removeDialog.description')}
                onConfirm={handleRemove}
                loading={removing}
                error={removeError}
            />
        </section>
    );
}
