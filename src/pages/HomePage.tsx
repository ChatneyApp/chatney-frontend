import {Link} from 'react-router';

export const HomePage = () => (
    <div>
        <Link to="/client">Client</Link>
        <Link to="/dashboard">Dashboard</Link>
        <h1 className="text-red-700">Home</h1>
    </div>
);
