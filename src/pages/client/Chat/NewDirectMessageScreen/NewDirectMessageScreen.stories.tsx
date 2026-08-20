import type { Meta, StoryObj } from '@storybook/react-vite';
import { MockedProvider } from '@apollo/client/testing/react';
import { action } from 'storybook/actions';
import { NewDirectMessageScreen } from './NewDirectMessageScreen';
import { SEARCH_USERS_BY_NICKNAME_QUERY } from '@/graphql/users';
import { mockDirectMessageUser } from '@/test-utils/fixtures/channels';

const mocks = [
    {
        request: { query: SEARCH_USERS_BY_NICKNAME_QUERY, variables: { prefix: 'gra' } },
        result: {
            data: {
                users: {
                    searchByNickname: [mockDirectMessageUser],
                },
            },
        },
    },
];

const meta: Meta<typeof NewDirectMessageScreen> = {
    title: 'pages/client/Chat/NewDirectMessageScreen',
    component: NewDirectMessageScreen,
    decorators: [
        (Story) => (
            <MockedProvider mocks={mocks}>
                <Story />
            </MockedProvider>
        ),
    ],
};
export default meta;

type Story = StoryObj<typeof NewDirectMessageScreen>;

/** Full-pane composer used instead of a popup when starting a direct message. */
export const Default: Story = {
    args: {
        onCancel: action('onCancel'),
        onOpened: action('onOpened'),
    },
};
