import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { RoleAclDraft } from '@/helpers/roleAcls';
import { Permission, PermissionGroup } from '@/types/acls';

import { SecureObjectEntry, SecureObjectKind } from './secureObjects';
import styles from './RolePermissionsEditor.module.css';

type Props = {
    value: RoleAclDraft[];
    onChange: (value: RoleAclDraft[]) => void;
    secureObjects: SecureObjectEntry[];
    permissionGroups: PermissionGroup[];
};

const kindLabelKeys: Record<SecureObjectKind, string> = {
    global: 'admin.roles.permissionsBlock.kinds.global',
    workspace: 'admin.roles.permissionsBlock.kinds.workspace',
    channelType: 'admin.roles.permissionsBlock.kinds.channelType',
    channel: 'admin.roles.permissionsBlock.kinds.channel',
};

// Groups come from the backend with English labels; every permission in a group shares a prefix
// (CHANNEL_, ROLE_, ...), which gives a stable translation key.
const groupLabelKey = (group: PermissionGroup) =>
    `admin.roles.permissionGroups.${group.list[0]?.split('_')[0].toLowerCase()}`;

export function RolePermissionsEditor({ value, onChange, secureObjects, permissionGroups }: Props) {
    const { t } = useTranslation();
    const [selectedSecObjId, setSelectedSecObjId] = useState('');
    // Entries the form opened with start collapsed; ones added afterwards open to pick permissions.
    const [initialSecObjIds] = useState(() => new Set(value.map((acl) => acl.secObjId)));

    const entriesBySecObjId = useMemo(
        () => new Map(secureObjects.map((entry) => [entry.secObjId, entry])),
        [secureObjects],
    );

    const addedSecObjIds = new Set(value.map((acl) => acl.secObjId));
    const available = secureObjects.filter((entry) => !addedSecObjIds.has(entry.secObjId));
    const availableWorkspaces = available.filter((entry) => entry.kind === 'workspace');
    const availableChannelTypes = available.filter((entry) => entry.kind === 'channelType');
    const availableChannels = available.filter((entry) => entry.kind === 'channel');
    const workspaces = secureObjects.filter((entry) => entry.kind === 'workspace');
    const workspaceIds = new Set(workspaces.map((workspace) => workspace.id));
    const channelsWithoutWorkspace = availableChannels.filter(
        (channel) => channel.workspaceId == null || !workspaceIds.has(channel.workspaceId),
    );

    const handleAdd = () => {
        const secObjId = Number(selectedSecObjId);
        if (!selectedSecObjId || addedSecObjIds.has(secObjId)) {
            return;
        }

        onChange([...value, { secObjId, permissions: [] }]);
        setSelectedSecObjId('');
    };

    const handleRemove = (secObjId: number) => {
        onChange(value.filter((acl) => acl.secObjId !== secObjId));
    };

    const handleToggle = (secObjId: number, permission: Permission, checked: boolean) => {
        onChange(value.map((acl) => {
            if (acl.secObjId !== secObjId) {
                return acl;
            }

            return {
                ...acl,
                permissions: checked
                    ? [...acl.permissions, permission]
                    : acl.permissions.filter((item) => item !== permission),
            };
        }));
    };

    const renderOption = (entry: SecureObjectEntry) => (
        <option key={entry.secObjId} value={entry.secObjId}>{entry.name}</option>
    );

    return (
        <div className={styles.editor}>
            {value.length === 0 && (
                <p className={styles.empty}>{t('admin.roles.permissionsBlock.empty')}</p>
            )}

            {value.map((acl) => {
                const entry = entriesBySecObjId.get(acl.secObjId);
                const name = entry?.name ?? t('admin.roles.permissionsBlock.unknownObject', { id: acl.secObjId });

                return (
                    <details key={acl.secObjId} className={styles.entry} open={!initialSecObjIds.has(acl.secObjId)}>
                        <summary className={styles.entryHeader}>
                            <span className={styles.kind}>
                                {entry ? t(kindLabelKeys[entry.kind]) : t('admin.roles.permissionsBlock.kinds.unknown')}
                            </span>
                            <span className={styles.entryName}>{name}</span>
                            <span className={styles.count}>
                                {t('admin.roles.permissionsBlock.selectedCount', { count: acl.permissions.length })}
                            </span>
                            <button
                                type="button"
                                className={styles.removeButton}
                                aria-label={t('admin.roles.permissionsBlock.remove', { name })}
                                title={t('admin.roles.permissionsBlock.remove', { name })}
                                onClick={(event) => {
                                    // Keeps the click from toggling the surrounding <details>.
                                    event.preventDefault();
                                    handleRemove(acl.secObjId);
                                }}
                            >
                                ×
                            </button>
                        </summary>

                        <div className={styles.groups}>
                            {permissionGroups.map((group) => (
                                <fieldset key={group.label} className={styles.group}>
                                    <legend className={styles.groupTitle}>
                                        {t(groupLabelKey(group), { defaultValue: group.label })}
                                    </legend>
                                    <div className={styles.permissionList}>
                                        {group.list.map((permission) => (
                                            <label key={permission} className={styles.permissionItem}>
                                                <input
                                                    type="checkbox"
                                                    className={styles.checkbox}
                                                    checked={acl.permissions.includes(permission)}
                                                    onChange={(event) => handleToggle(acl.secObjId, permission, event.target.checked)}
                                                />
                                                {t(`admin.roles.permissionNames.${permission}`, { defaultValue: permission })}
                                            </label>
                                        ))}
                                    </div>
                                </fieldset>
                            ))}
                        </div>
                    </details>
                );
            })}

            <div className={styles.addRow}>
                <select
                    className={styles.select}
                    aria-label={t('admin.roles.permissionsBlock.objectToAdd')}
                    value={selectedSecObjId}
                    onChange={(event) => setSelectedSecObjId(event.target.value)}
                    disabled={available.length === 0}
                >
                    <option value="">
                        {available.length === 0
                            ? t('admin.roles.permissionsBlock.allAdded')
                            : t('admin.roles.permissionsBlock.chooseObject')}
                    </option>
                    {available.filter((entry) => entry.kind === 'global').map(renderOption)}
                    {availableWorkspaces.length > 0 && (
                        <optgroup label={t('admin.roles.permissionsBlock.groups.workspaces')}>
                            {availableWorkspaces.map(renderOption)}
                        </optgroup>
                    )}
                    {availableChannelTypes.length > 0 && (
                        <optgroup label={t('admin.roles.permissionsBlock.groups.channelTypes')}>
                            {availableChannelTypes.map(renderOption)}
                        </optgroup>
                    )}
                    {workspaces.map((workspace) => {
                        const workspaceChannels = availableChannels.filter((channel) => channel.workspaceId === workspace.id);
                        if (workspaceChannels.length === 0) {
                            return null;
                        }

                        return (
                            <optgroup
                                key={workspace.secObjId}
                                label={t('admin.roles.permissionsBlock.groups.channelsIn', { workspace: workspace.name })}
                            >
                                {workspaceChannels.map(renderOption)}
                            </optgroup>
                        );
                    })}
                    {channelsWithoutWorkspace.length > 0 && (
                        <optgroup label={t('admin.roles.permissionsBlock.groups.channels')}>
                            {channelsWithoutWorkspace.map(renderOption)}
                        </optgroup>
                    )}
                </select>
                <button
                    type="button"
                    className={styles.addButton}
                    onClick={handleAdd}
                    disabled={!selectedSecObjId}
                >
                    {t('admin.roles.permissionsBlock.add')}
                </button>
            </div>
        </div>
    );
}
