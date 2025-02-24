import { Link, Outlet } from "react-router";
import { HomeIcon } from 'lucide-react';

import { Button } from "@/components/ui/button";

export const DashboardLayout = () => (
    <div>
        <h1>Dashboard</h1>
        <div className="flex">
            <Button>
                <Link to="/dashboard">
                    <HomeIcon />
                </Link>
            </Button>
            <Button>
                <Link to="/dashboard/permissions">Permissions</Link>
            </Button>
            <Button>
                <Link to="/dashboard/channelTypes">Channel types</Link>
            </Button>
            <Button>
                <Link to="/dashboard/channels">Channels</Link>
            </Button>
            <Button>
                <Link to="/dashboard/users">Users</Link>
            </Button>
        </div>
        <Outlet />
    </div>
);