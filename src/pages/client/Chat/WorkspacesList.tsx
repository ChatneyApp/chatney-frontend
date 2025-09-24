import { useWorkspacesList } from "@/contexts/WorkspacesListContext";

export default function WorkspacesList() {
    const workspacesList = useWorkspacesList()

    return (
        <div className="w-16 bg-gray-800 flex flex-col items-center py-4 space-y-4">
            {workspacesList.workspaces.map((ws, idx) => (
                <div
                    title={ws.name}
                    key={idx}
                    className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-full text-sm hover:bg-gray-600 cursor-pointer"
                >
                    {ws.name[0].toUpperCase()}
                </div>
            ))}
        </div>
    );
}
