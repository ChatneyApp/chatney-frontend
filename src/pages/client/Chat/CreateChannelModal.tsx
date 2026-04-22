import { useState, useEffect, useRef } from 'react';
import { useApolloClient } from '@apollo/client/react';
import { addChannel } from '@/graphql/channels';
import { useWorkspacesList } from '@/contexts/WorkspacesListContext';
import { Channel } from '@/types/channels';
import { useChannelTypesList } from '@/contexts/ChannelTypesListContext';
import { ChannelTypeId } from '@/types/channelTypes';

interface CreateChannelModalProps {
    onClose: () => void;
    onChannelCreated: (channel: Channel) => void;
}

export function CreateChannelModal({ onClose, onChannelCreated }: CreateChannelModalProps) {
    const wsCtx = useWorkspacesList();
    const { channelTypes } = useChannelTypesList();
    const client = useApolloClient();
    const [channelTypeId, setChannelTypeId] = useState<ChannelTypeId>(channelTypes[0]?.id || 0);
    const [channelName, setChannelName] = useState('');
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const handleCreate = async () => {
        if (!channelName.trim()) {
            return;
        }
        const activeWorkspaceId = wsCtx.activeWorkspaceId;
        if (!activeWorkspaceId) {
            throw new Error('Active Workspace is not set');
        }

        try {
            const channelTypeId = channelTypes[0].id;
            const newChannel = await addChannel(client, channelName.trim(), channelTypeId, activeWorkspaceId);
            onChannelCreated(newChannel);
            setChannelName('');
        } catch (error) {
            console.error('Error creating channel:', error);
        }
    };

    return (
        <div className="absolute top-13 left-1 bg-gray-800 text-white p-4 rounded shadow-md w-64" ref={modalRef}>
            <h3 className="text-lg font-semibold mb-2">Create Channel</h3>
            <input
                type="text"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                className="w-full px-2 py-1 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none mb-3"
                placeholder="Channel name"
            />
            <select
                value={channelTypeId}
                onChange={(e) => setChannelTypeId(parseInt(e.target.value, 10))}
            >
                {channelTypes.map(channelType => (
                    <option
                        key={channelType.id}
                        value={channelType.id}
                    >
                        {channelType.name}
                    </option>
                ))}
            </select>
            <div className="flex justify-end space-x-2">
                <button
                    onClick={onClose}
                    className="text-sm text-gray-300 hover:text-white"
                >
                    Cancel
                </button>
                <button
                    onClick={handleCreate}
                    className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                >
                    Create
                </button>
            </div>
        </div>
    );
}
