import { useMutation } from '@apollo/client/react';

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
                <span className={styles.labelTitle}>Label:</span> {channelType.name}
            </div>
            <div className={styles.uuid}>
                {channelType.id}
            </div>
            <div className={styles.key}>
                <span className={styles.keyTitle}>Key:</span> {channelType.key}
            </div>
            <div className={styles.controls}>
                <CreateChannelTypeForm cta="Edit" title="Edit Channel Type" submitText="Save Changes" channelType={channelType}/>
                <Button onClick={handleDelete}>
                    Delete
                </Button>
            </div>
        </div>
    );
}; 
