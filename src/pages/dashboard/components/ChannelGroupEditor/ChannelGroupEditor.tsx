import { useMutation } from '@apollo/client';

import { Button } from '@/components/Button';
import { DELETE_CHANNEL_GROUP } from '@/graphql/channelGroups';
import { useWorkspaceChannelGroupsList } from '@/contexts/WorkspaceChannelGroupsListContext';
import { ChannelGroupForm } from '@/pages/dashboard/components/ChannelGroupForm/ChannelGroupForm';
import { ChannelGroup } from '@/types/channelGroups';
import styles from './ChannelGroupEditor.module.css';
import { useWorkspaceChannelsList } from '@/contexts/WorkspaceChannelsListContext';

type Props = {
    channelGroup: ChannelGroup;
}

export const ChannelGroupEditor = ({ channelGroup }: Props) => {
    const { refetch } = useWorkspaceChannelGroupsList();
    const { channels } = useWorkspaceChannelsList();

    const [ deleteChannelGroup ] = useMutation(DELETE_CHANNEL_GROUP, {
        onCompleted: () => {
            refetch();
        },
        onError: () => {}
    });

    const handleDelete = async () => {
        await deleteChannelGroup({
            variables: {
                id: channelGroup.id
            }
        });
    };

    const groupChannels = channels.filter(channel => channelGroup.channelIds.includes(channel.id));
    const groupChannelNames = groupChannels.map(channel => channel.name);

    return (
        <div className={styles.container}>
            <div className={styles.name}>
                {channelGroup.name}
            </div>
            <div className={styles.order}>
                Order: {channelGroup.order}
            </div>
            <div className={styles.uuid}>
                {channelGroup.id}
            </div>
            <div className={styles.channels}>
                <div className={styles.channelList}>
                    {groupChannelNames.map(name => (
                        <div key={name} className={styles.channelListItem}>
                            {name}
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.controls}>
                <ChannelGroupForm cta="Edit" title="Edit Channel Group" submitText="Save Changes" channelGroup={channelGroup}/>
                <Button onClick={handleDelete}>
                    Delete
                </Button>
            </div>
        </div>
    );
};
