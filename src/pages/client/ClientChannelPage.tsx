import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router';

import { UserDataProvider, useUserData } from '@/contexts/UserDataContext';
import { UserChannelProvider, useUserChannel } from '@/contexts/UserChannelProvider';
import { useMutation } from '@apollo/client';
import { POST_MESSAGE } from '@/graphql/messages';
import { CreateMessageInput, Message } from '@/types/messages';

const MessageEditor = () => {
    const { userData } = useUserData();
    const { channel } = useUserChannel();
    const [ text, setText ] = useState('');
    const [ isPosting, setIsPosting ] = useState(false);

    const [ postMessage ] = useMutation<Message, {messageDto: CreateMessageInput}>(POST_MESSAGE, {
        onCompleted: () => {
            setIsPosting(false);
        },
        onError: (_error) => {
            // TODO: alert user
        }
    });

    if (!channel || !userData) {
        return null;
    }

    const handlePostMessage = () => {
        setIsPosting(true);
        postMessage({
            variables: {
                messageDto: {
                    parentId: null,
                    userId: userData.Id,
                    attachments: [],
                    content: text,
                    channelId: channel.id,
                }
            }
        });
    }

    return (
        <div className="p-4 border rounded-md bg-gray-600 text-white">
            <h2 className="text-lg font-semibold mb-2">Message Editor</h2>
            <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={!channel}
                type="text"
                className="w-full h-32 p-2 border rounded-md"
                placeholder={`Write a message for channel: ${channel?.name || 'Loading...'}`}
            />
            <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                disabled={!channel || isPosting}
                onClick={handlePostMessage}
            >
                Send Message
            </button>
        </div>
    )
};

const ChannelCore = () => {
    const { channel } = useUserChannel();

    if (!channel) {
        return null;
    }

    return <div className="flex flex-col gap-2">
        <Link to="/client/workspaces">Go back to workspaces</Link>
        <div>{channel?.name}</div>
        <MessageEditor/>
    </div>;
};

export const ClientChannelPage = () => {
    const { uuid } = useParams<{ uuid: string }>();
    const navigate = useNavigate();

    if (!uuid) {
        navigate('/client/workspaces');
        return null;
    }

    return (
        <div>
            <h1>
                Channel Details
            </h1>
            <UserDataProvider>
                <UserChannelProvider channelId={uuid}>
                    <ChannelCore/>
                </UserChannelProvider>
            </UserDataProvider>
        </div>
    );
}
