import { Link } from "react-router";
import { Button } from "@/components/ui/button";

export const HomePage = () => (
    <div>
        <Button><Link to="/client">Client</Link></Button>
        <Button><Link to="/dashboard">Dashboard</Link></Button>
    </div>
);