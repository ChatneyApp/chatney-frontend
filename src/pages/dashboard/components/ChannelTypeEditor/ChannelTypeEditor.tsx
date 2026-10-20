import { useMutation } from '@apollo/client/react';
import { useTranslation } from 'react-i18next';

import { ChannelType } from '@/types/channelTypes';
import { CreateChannelTypeForm } from '@/pages/dashboard/components/ChannelTypeForm/CreateChannelTypeForm';
import { Button } from '@/components/Button';
import { DELETE_CHANNEL_TYPE } from '@/graphql/channelTypes';
import { useChannelTypesList } from '@/contexts/ChannelTypesListContext';
import styles from './ChannelTypeEditor.module.css';

type Props = {
    channelType: ChannelType;
}

export const ChannelTypeEditor = ({ channelType }: Props) => {
    const { t } = useTranslation();
    const { refetch } = useChannelTypesList();

    const [deleteChannelType] = useMutation(DELETE_CHANNEL_TYPE, {
        onCompleted: () => {
            refetch();
        },
        onError: () => {}
    });

    const handleDelete = async () => {
        await deleteChannelType({
            variables: {
                id: channelType.id
            }
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.label}>
                <span className={styles.labelTitle}>{t('dashboard.channelTypes.labelTitle')}</span> {channelType.name}
            </div>
            <div className={styles.uuid}>
                {channelType.id}
            </div>
            <div className={styles.key}>
                <span className={styles.keyTitle}>{t('dashboard.channelTypes.keyTitle')}</span> {channelType.key}
            </div>
            <div className={styles.controls}>
                <CreateChannelTypeForm cta={t('common.edit')} title={t('dashboard.channelTypes.editTitle')} submitText={t('common.saveChanges')} channelType={channelType}/>
                <Button onClick={handleDelete}>
                    {t('common.delete')}
                </Button>
            </div>
        </div>
    );
}; 
