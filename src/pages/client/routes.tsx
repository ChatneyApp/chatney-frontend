import { Route } from 'react-router';

import { ClientLayout } from '@/pages/client/ClientLayout';
import { ChatPage } from './Chat/ChatPage';

export const clientRoutes = () => (
    <>
        <Route path="client" element={<ClientLayout />}>
            <Route path="chat" index element={<ChatPage />} />
        </Route>
    </>
);
