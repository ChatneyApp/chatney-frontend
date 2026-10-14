import { useMutation } from '@apollo/client/react';

import { Channel } from '@/types/channels';
import { Button } from '@/components/Button';
import { DELETE_CHANNEL, removeChannelFromCache } from '@/graphql/channels';
import styles from './ChannelEditor.module.css';
import { useChannelTypesList } from '@/contexts/ChannelTypesListContext';
import { CreateChannelForm } from '@/pages/dashboard/components/ChannelForm/CreateChannelForm';

type Props = {
    channel: Channel;
}

export const ChannelEditor = ({ channel }: Props) => {
    const { channelTypes } = useChannelTypesList();

    const [deleteChannel] = useMutation(DELETE_CHANNEL, {
        update: (cache, { data }) => {
            if (data?.channels.deleteChannel) {
                removeChannelFromCache(cache, channel.id);
            }
        },
        onError: () => {}
    });

    const handleDelete = async () => {
        await deleteChannel({
            variables: {
                id: channel.id
            }
        });
    };

    const channelType = channelTypes.find(type => type.id === channel.channelTypeId);

    return (
        <div className={styles.container}>
            <div className={styles.name}>
                {channel.name}
            </div>
            <div className={styles.uuid}>
                {channel.id}
            </div>
            <div className={styles.channelType}>
                Channel type: {channelType?.name ?? 'Unknown Channel Type'}
            </div>
            <div className={styles.controls}>
                <CreateChannelForm cta="Edit" title="Edit Channel" submitText="Save Changes" channel={channel}/>
                <Button onClick={handleDelete}>
                    Delete
                </Button>
            </div>
        </div>
    );
};
