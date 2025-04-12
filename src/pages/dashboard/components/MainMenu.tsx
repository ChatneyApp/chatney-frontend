import {PropsWithChildren} from 'react';
import {Link} from 'react-router';
import {HomeIcon} from 'lucide-react';

const MenuItem = ({children}: PropsWithChildren) => (
    <button className="p-4 m-0 bg-amber-800 text-white font-bold hover:bg-amber-600">
        {children}
    </button>
);

export const MainMenu = () => (
    <div className="inline-flex flex-row gap-0 rounded-full overflow-hidden">
        <MenuItem>
            <Link to="/dashboard">
                <HomeIcon/>
            </Link>
        </MenuItem>
        <MenuItem>
            <Link to="/dashboard/permissions">Permissions</Link>
        </MenuItem>
        <MenuItem>
            <Link to="/dashboard/roles">Roles</Link>
        </MenuItem>
        <MenuItem>
            <Link to="/dashboard/channelTypes">Channel types</Link>
        </MenuItem>
        <MenuItem>
            <Link to="/dashboard/channels">Channels</Link>
        </MenuItem>
        <MenuItem>
            <Link to="/dashboard/users">Users</Link>
        </MenuItem>
    </div>
);
