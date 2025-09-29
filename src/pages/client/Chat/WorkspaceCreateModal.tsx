import { addWorkspace } from "@/graphql/workspaces";
import { useApolloClient } from "@apollo/client";
import { useState, useEffect, useRef } from "react";

interface WorkspaceCreateModalProps {
    onClose: () => void;
    onWorkspaceCreated: (workspace: { id: string; name: string }) => void;
}

export function WorkspaceCreateModal({ onClose, onWorkspaceCreated }: WorkspaceCreateModalProps) {
    const [ workspaceName, setWorkspaceName ] = useState("");
    const modalRef = useRef<HTMLDivElement>(null);
    const client = useApolloClient()

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
    }, [ onClose ]);

    const handleCreate = async () => {
        if (!workspaceName.trim()) {
            return;
        }

        try {
            const newWorkspace = await addWorkspace({ name: workspaceName.trim(), client });
            onWorkspaceCreated(newWorkspace);
            setWorkspaceName("");
        } catch (error) {
            console.error("Error creating workspace:", error);
        }
    };

    return (
        <div className="z-50 absolute top-13 left-1 bg-gray-800 text-white p-4 rounded shadow-md w-64" ref={modalRef}>
            <h3 className="text-lg font-semibold mb-2">Create Workspace</h3>
            <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="w-full px-2 py-1 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none mb-3"
                placeholder="Workspace name"
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
