import { channelListItem } from "./ChatPage";

export function ChannelList({ activeChannel, setActiveChannel, channels }: { activeChannel: channelListItem, setActiveChannel: any, channels: channelListItem[] }) {
    return (
        <div className="w-48 bg-gray-850 border-r border-gray-700 p-4 space-y-2">
            {channels.map((channel) => (
                <div
                    key={channel.id}
                    onClick={() => setActiveChannel(channel)}
                    className={`cursor-pointer px-2 py-1 rounded hover:bg-gray-700 ${activeChannel.id === channel.id ? 'font-bold text-white' : 'text-gray-400'
                        }`}
                >
                    {channel.name}
                </div>
            ))}
        </div>
    );
}
