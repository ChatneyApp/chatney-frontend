import { useState } from "react";
import { ChannelListItem } from "./ChatPage";
import { CreateChannelModal } from "./CreateChannelModal";

type Props = {
    activeChannel: ChannelListItem;
    setActiveChannel(channel: ChannelListItem): void;
    channels: ChannelListItem[];
};
export function ChannelList({ activeChannel, setActiveChannel, channels }: Props) {
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ localChannels, setLocalChannels ] = useState(channels);

    const handleChannelCreated = (newChannel: ChannelListItem) => {
        setLocalChannels([ ...localChannels, newChannel ]);
        setActiveChannel(newChannel);
        setIsModalOpen(false);
    };

    return (
        <div className="w-48 bg-gray-850 border-r border-gray-700 p-4 space-y-2 text-gray-400 relative">
            <div
                className="cursor-pointer hover:text-gray-200 px-2 py-1 rounded hover:bg-gray-700"
                onClick={() => setIsModalOpen(true)}
            >
                + Create channel
            </div>

            {localChannels.map((channel) => (
                <div
                    key={channel.id}
                    onClick={() => setActiveChannel(channel)}
                    className={`cursor-pointer px-2 py-1 rounded hover:bg-gray-700 ${activeChannel.id === channel.id ? "font-bold text-white" : "text-gray-400"
                        }`}
                >
                    {channel.name}
                </div>
            ))}

            {isModalOpen && (
                <CreateChannelModal
                    onClose={() => setIsModalOpen(false)}
                    onChannelCreated={handleChannelCreated}
                />
            )}
        </div>
    );
}
