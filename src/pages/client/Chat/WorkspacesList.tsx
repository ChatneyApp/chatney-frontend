import { UseUser } from "@/contexts/UserContext";
import { useWorkspacesList } from "@/contexts/WorkspacesListContext";

export default function WorkspacesList() {
    const workspacesList = useWorkspacesList();
    const userCtx = UseUser();

    return (
        <div className="w-16 bg-gray-800 flex flex-col justify-between items-center py-4">
            {/* Top Section - Workspaces */}
            <div className="space-y-4">
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

            {/* Bottom Section - User Avatar + Logout */}
            <div className="space-y-2 flex flex-col items-center">
                {/* Avatar */}
                <div
                    className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm"
                    title="Your Profile"
                >
                    {userCtx?.user?.name[0].toUpperCase()}
                </div>

                {/* Logout Button */}
                <button
                    onClick={() => {
                        // TODO: Add your logout logic here
                        userCtx?.logout()
                    }}
                    className="text-base cursor-pointer text-gray-400 hover:text-white"
                    title="Logout"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
