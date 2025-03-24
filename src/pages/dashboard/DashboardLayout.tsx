import {Link, Outlet} from "react-router";
import {HomeIcon} from 'lucide-react';

export const DashboardLayout = () => (
    <div>
        <h1>Dashboard</h1>
        <div className="flex">
            <button>
                <Link to="/dashboard">
                    <HomeIcon/>
                </Link>
            </button>
            <button>
                <Link to="/dashboard/permissions">Permissions</Link>
            </button>
            <button>
                <Link to="/dashboard/roles">Roles</Link>
            </button>
            <button>
                <Link to="/dashboard/channelTypes">Channel types</Link>
            </button>
            <button>
                <Link to="/dashboard/channels">Channels</Link>
            </button>
            <button>
                <Link to="/dashboard/users">Users</Link>
            </button>
        </div>
        <Outlet/>
    </div>
);
