import { useState, useRef, useEffect } from "react";
import { UseUser } from "@/contexts/UserContext";
import { useWorkspacesList } from "@/contexts/WorkspacesListContext";
import { WorkspaceCreateModal } from "./WorkspaceCreateModal";
import { Workspace } from "@/types/workspaces";

export function WorkspacesList() {
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const workspacesList = useWorkspacesList();
    const userCtx = UseUser();
    const [ showPopup, setShowPopup ] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);
    const avatarRef = useRef<HTMLDivElement>(null);

    const handleWorkspaceCreated = (newWs: Workspace) => {
        workspacesList.setWorkspacesList([ ...workspacesList.workspacesList, newWs ]);
        workspacesList.setActiveWorkspaceId(newWs.id);
        setIsModalOpen(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if ((popupRef.current && !popupRef.current.contains(event.target as Node)) &&
            (avatarRef.current && !avatarRef.current.contains(event.target as Node))) {
            setShowPopup(false);
        }
    };

    useEffect(() => {
        if (showPopup) {
            document.addEventListener("mouseup", handleClickOutside);
        } else {
            document.removeEventListener("mouseup", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mouseup", handleClickOutside);
        };
    }, [ showPopup ]);

    return (
        <div className="relative w-16 bg-gray-800 flex flex-col justify-between items-center py-4">
            {/* Workspaces */}
            <div className="space-y-4">
                {workspacesList.workspacesList.map((ws, idx) => (
                    <div
                        title={ws.name}
                        key={idx}
                        onClick={() => workspacesList.setActiveWorkspaceId(ws.id)}
                        className={`${workspacesList.activeWorkspaceId === ws.id ? "bg-gray-500" : "bg-gray-700"} w-10 h-10 flex items-center justify-center rounded-full text-sm hover:bg-gray-500 cursor-pointer`}
                    >
                        <span className={workspacesList.activeWorkspaceId === ws.id ? "font-bold" : ""}>{ws.name[0].toUpperCase()}</span>
                    </div>
                ))}
                <div
                    onClick={() => setIsModalOpen(true)}
                    title="Create workspace"
                    className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-full text-sm hover:bg-gray-600 cursor-pointer"
                >
                    +
                </div>
                {isModalOpen && (
                    <WorkspaceCreateModal
                        onClose={() => setIsModalOpen(false)}
                        onWorkspaceCreated={handleWorkspaceCreated}
                    />
                )}

            </div>

            {/* Avatar and Popup */}
            <div className="space-y-2 flex flex-col items-center relative">
                {/* Popup */}
                {showPopup && (
                    <div
                        ref={popupRef}
                        className="border border-gray-700 bg-gray-800 absolute left-16 -bottom-3 z-50 w-64 rounded-md shadow-lg p-4 text-sm text-gray-800"
                    >
                        {/* Chevron */}
                        <div className="absolute left-[-6px] bottom-[38px] w-3 h-3 bg-gray-800 border-b border-l border-gray-700 rotate-45 shadow-md" />

                        {/* User Info */}
                        <div className="mb-3">
                            <div className="font-semibold text-gray-200 text-base">{userCtx?.user?.name}</div>
                            <div className="text-xs text-gray-500">Role</div>
                        </div>

                        {/* Links */}
                        <ul className="space-y-2 text-gray-400">
                            <li>
                                <a href="/dashboard" className="hover:text-gray-200">
                                    Dashboard
                                </a>
                            </li>
                            <li>
                                <a href="/settings" className="hover:text-gray-200">
                                    Settings
                                </a>
                            </li>
                            <li>
                                <a href="/profile" className="hover:text-gray-200">
                                    Profile
                                </a>
                            </li>
                            <li>
                                <a href="/help" className="hover:text-gray-200">
                                    Help & Support
                                </a>
                            </li>
                            <br />
                            <li>
                                <a onClick={() => userCtx?.logout()} className="cursor-pointer hover:text-gray-200">
                                    Logout
                                </a>
                            </li>
                        </ul>
                    </div>
                )}

                {/* Avatar */}
                <div
                    ref={avatarRef}
                    className="mb-5 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm cursor-pointer"
                    title="Your Profile"
                    onClick={() => setShowPopup(!showPopup)}
                >
                    {userCtx?.user?.name[0].toUpperCase()}
                </div>
            </div>
        </div>
    );
}
