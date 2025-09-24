const channels = ['general', 'random', 'tech', 'design'];

export function ChannelList({ activeChannel, setActiveChannel }: { activeChannel: string, setActiveChannel: any }) {
    return (
        <div className="w-48 bg-gray-850 border-r border-gray-700 p-4 space-y-2">
            {channels.map((channel) => (
                <div
                    key={channel}
                    onClick={() => setActiveChannel(channel)}
                    className={`cursor-pointer px-2 py-1 rounded hover:bg-gray-700 ${activeChannel === channel ? 'font-bold text-white' : 'text-gray-400'
                        }`}
                >
                    {channel}
                </div>
            ))}
        </div>
    );
}
