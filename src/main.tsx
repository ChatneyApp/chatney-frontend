import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './App';

// Websocket TEMP hack
// TODO: kill this
sessionStorage.setItem('deviceId', crypto.randomUUID());
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App/>
    </StrictMode>,
);
