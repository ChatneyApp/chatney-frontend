import { BrowserRouter, Routes, Route } from "react-router";

import { HomePage } from './pages/HomePage';
import { DashboardLayout } from "./pages/dashboard/DashboardLayout";
import { DashboardHomePage } from "./pages/dashboard/DashboardHomePage";
import { DashboardPermissionsPage } from "./pages/dashboard/DashboardPermissionsPage";
import { DashboardChannelTypesPage } from "./pages/dashboard/DashboardChannelTypesPage";
import { DashboardChannelsPage } from "./pages/dashboard/DashboardChannelsPage";
import { ClientLayout } from "./pages/client/ClientLayout";
import { ClientHomePage } from "./pages/client/ClientHomePage";
import { DashboardUsersPage } from "./pages/dashboard/DashboardUsersPage";

export const App = () => (
  <BrowserRouter>
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardHomePage />} />
        <Route path="permissions" element={<DashboardPermissionsPage />} />
        <Route path="channelTypes" element={<DashboardChannelTypesPage />} />
        <Route path="channels" element={<DashboardChannelsPage />} />
        <Route path="users" element={<DashboardUsersPage />} />
      </Route>
      <Route path="client" element={<ClientLayout />}>
        <Route index element={<ClientHomePage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
