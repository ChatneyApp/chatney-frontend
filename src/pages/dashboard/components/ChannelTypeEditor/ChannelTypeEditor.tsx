import {useMutation} from '@apollo/client';

import {ChannelType} from '@/types/channelTypes';
import {CreateChannelTypeForm} from '@/pages/dashboard/components/ChannelTypeForm/CreateChannelTypeForm';
import {Button} from '@/components/Button';
import {DELETE_CHANNEL_TYPE} from '@/graphql/channelTypes';
import {useChannelTypesList} from '@/contexts/ChannelTypesListContext';
import {useRolesList} from '@/contexts/RolesListContext';
import styles from './ChannelTypeEditor.module.css';

type Props = {
    channelType: ChannelType;
}

export const ChannelTypeEditor = ({channelType}: Props) => {
    const {refetch} = useChannelTypesList();
    const {roles} = useRolesList();
    
    const [deleteChannelType] = useMutation(DELETE_CHANNEL_TYPE, {
        onCompleted: () => {
            refetch();
        },
        onError: () => {}
    });

    const handleDelete = async () => {
        await deleteChannelType({
            variables: {
                channelTypeId: channelType.Id
            }
        });
    };

    // Find the role name based on BaseRoleId
    const baseRole = roles.find(role => role.Id === channelType.BaseRoleId);

    return (
        <div className={styles.container}>
            <div className={styles.label}>
                <span className={styles.labelTitle}>Label:</span> {channelType.Label}
            </div>
            <div className={styles.uuid}>
                {channelType.Id}
            </div>
            <div className={styles.key}>
                <span className={styles.keyTitle}>Key:</span> {channelType.Key}
            </div>
            <div className={styles.baseRole}>
                <span className={styles.baseRoleTitle}>Base Role:</span> {baseRole?.Name || 'Unknown Role'}
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