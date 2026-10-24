import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { ConfirmDialog } from './ConfirmDialog';

const meta: Meta<typeof ConfirmDialog> = {
    title: 'components/ConfirmDialog',
    component: ConfirmDialog,
    args: {
        open: true,
        title: 'Delete role',
        description: 'Delete role "Moderators"? This action cannot be undone.',
        onOpenChange: fn(),
        onConfirm: fn(),
    },
};
export default meta;

type Story = StoryObj<typeof ConfirmDialog>;

/** Asking the user to confirm a destructive action. */
export const Default: Story = {
    args: {},
};

/** The action is in progress: OK is disabled until it finishes. */
export const Loading: Story = {
    args: {
        loading: true,
    },
};

/** The action failed: the dialog stays open and shows the error, OK retries. */
export const WithError: Story = {
    args: {
        error: "You don't have permission to delete roles.",
    },
};
