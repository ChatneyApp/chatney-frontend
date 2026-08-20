import { Route } from 'react-router';

import { ClientLayout } from '@/pages/client/ClientLayout';
import { ChatPage } from './Chat/ChatPage';

export const clientRoutes = () => (
    <>
        <Route path="client" element={<ClientLayout/>}>
            <Route index element={<ChatPage/>}/>
            <Route path="chat" element={<ChatPage/>}/>
            <Route path="chat/new" element={<ChatPage/>}/>
        </Route>
    </>
);
