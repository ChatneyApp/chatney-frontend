const channels = [{ id: 'ty', name: 'general' }, { id: '43', name: 'random' }, { name: 'tech', id: '1232' }, { name: 'design', id: 'qwe' }];

export type channel = {
    name: string,
    id: string
}

export function ChannelList({ activeChannel, setActiveChannel }: { activeChannel: channel, setActiveChannel: any }) {
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
