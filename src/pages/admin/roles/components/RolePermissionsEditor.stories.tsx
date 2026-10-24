import { ComponentProps, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { mockPermissionGroups, mockRoleAclDrafts, mockSecureObjectEntries } from '@/test-utils/fixtures/acls';

import { RolePermissionsEditor } from './RolePermissionsEditor';

// Keeps the edited value in state so adding, removing and ticking work in the canvas.
function StatefulEditor({ value, onChange, ...props }: ComponentProps<typeof RolePermissionsEditor>) {
    const [acls, setAcls] = useState(value);

    return (
        <div style={{ maxWidth: 720 }}>
            <RolePermissionsEditor
                {...props}
                value={acls}
                onChange={(next) => {
                    setAcls(next);
                    onChange(next);
                }}
            />
        </div>
    );
}

const meta: Meta<typeof RolePermissionsEditor> = {
    title: 'admin/roles/RolePermissionsEditor',
    component: RolePermissionsEditor,
    args: {
        value: [],
        onChange: fn(),
        secureObjects: mockSecureObjectEntries,
        permissionGroups: mockPermissionGroups,
    },
    render: (args) => <StatefulEditor {...args} />,
};
export default meta;

type Story = StoryObj<typeof RolePermissionsEditor>;

/** A role with no grants: only the picker for adding the first object. */
export const Empty: Story = {
    args: {},
};

/** A role with grants on the global object, a workspace, a channel type and a channel. */
export const WithEntries: Story = {
    args: {
        value: mockRoleAclDrafts,
    },
};

/** Every object is already added, so the picker is disabled. */
export const AllObjectsAdded: Story = {
    args: {
        value: mockSecureObjectEntries.map((entry) => ({ secObjId: entry.secObjId, permissions: [] })),
    },
};

/** An ACL on an object missing from the catalog (e.g. deleted meanwhile) shows as unknown and can be removed. */
export const UnknownObject: Story = {
    args: {
        value: [{ secObjId: 999, permissions: ['CHANNEL_READ_CHANNEL'] }],
    },
};
