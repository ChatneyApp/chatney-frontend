import { useState, useEffect, useRef } from "react";
import { useApolloClient } from "@apollo/client";
import { addChannel } from "./chat.gql";
import { useWorkspacesList } from "@/contexts/WorkspacesListContext";

interface CreateChannelModalProps {
    onClose: () => void;
    onChannelCreated: (channel: { id: string; name: string }) => void;
}

export function CreateChannelModal({ onClose, onChannelCreated }: CreateChannelModalProps) {
    const wsCtx = useWorkspacesList();
    const client = useApolloClient();
    const [channelName, setChannelName] = useState("");
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    const handleCreate = async () => {
        if (!channelName.trim()) return;
        const activeWorkspaceId = wsCtx.activeWorkspaceId;
        if (!activeWorkspaceId) {
            throw new Error("Active Workspace is not set");
        }

        try {
            const newChannel = await addChannel({
                channelTypeId: 'e35bdf2d-1624-474a-a7dc-bb3580dc4bff',
                workspaceId: activeWorkspaceId,
                client,
                name: channelName.trim()
            });
            onChannelCreated(newChannel);
            setChannelName("");
        } catch (error) {
            console.error("Error creating channel:", error);
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
