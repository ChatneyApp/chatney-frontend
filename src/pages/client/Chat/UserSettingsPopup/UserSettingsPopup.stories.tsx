import type { Meta, StoryObj } from '@storybook/react-vite';
import { UserSettingsPopup } from './UserSettingsPopup';
import { withUser } from '@/test-utils/decorators/withUser';

const meta: Meta<typeof UserSettingsPopup> = {
    title: 'pages/client/Chat/UserSettingsPopup',
    component: UserSettingsPopup,
    decorators: [withUser()],
};
export default meta;

type Story = StoryObj<typeof UserSettingsPopup>;

/** The avatar trigger; click it to open the profile popup. */
export const Default: Story = {
    args: {},
};
