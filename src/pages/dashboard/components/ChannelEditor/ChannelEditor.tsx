import {useMutation} from '@apollo/client';

import {Channel} from '@/types/channels';
import {Button} from '@/components/Button';
import {DELETE_CHANNEL} from '@/graphql/channels';
import {useWorkspaceChannelsList} from '@/contexts/WorkspaceChannelsListContext';
import styles from './ChannelEditor.module.css';
import {useChannelTypesList} from '@/contexts/ChannelTypesListContext';
import {CreateChannelForm} from '@/pages/dashboard/components/ChannelForm/CreateChannelForm';

type Props = {
    channel: Channel;
}

export const ChannelEditor = ({channel}: Props) => {
    const {refetch} = useWorkspaceChannelsList();
    const {channelTypes} = useChannelTypesList();

    const [deleteChannel] = useMutation(DELETE_CHANNEL, {
        onCompleted: () => {
            refetch();
        },
        onError: () => {}
    });

    const handleDelete = async () => {
        await deleteChannel({
            variables: {
                channelId: channel.Id
            }
        });
    };

    const channelType = channelTypes.find(type => type.Id === channel.ChannelTypeId);

    return (
        <div className={styles.container}>
            <div className={styles.name}>
                {channel.Name}
            </div>
            <div className={styles.uuid}>
                {channel.Id}
            </div>
            <div className={styles.channelType}>
                Channel type: {channelType?.Label ?? 'Unknown Channel Type'}
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
