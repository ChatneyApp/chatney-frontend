import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';

import { useUser } from './UserContext';

interface WebSocketContext {
    setNewMessageReceived: Function
}

export const WebSocketContext = createContext<WebSocketContext>(null as unknown as WebSocketContext);

export function WebSocketContextProvider({ children }: { children: ReactNode }) {
    const userCtx = useUser();
    const newMessageReceivedRef = useRef<(message: any) => void>(() => { });

    useEffect(() => {
        const url = new URL(`${import.meta.env.VITE_WEBSOCKET_URL}`);
        url.searchParams.set('userId', `${userCtx?.user?.id ?? ''}-${Math.random()}`);

        const socket = new WebSocket(url.toString());

        socket.addEventListener('open', () => {
            console.log('WebSocket connected');
        });

        socket.addEventListener('message', (event) => {
            console.log('OOLOLO', event.data)
            const message = JSON.parse(event.data);
            newMessageReceivedRef.current(message);
        });

        socket.addEventListener('error', (event) => {
            console.error('WebSocket error:', event);
        });

        socket.addEventListener('close', () => {
            console.log('WebSocket closed');
        });

        return () => {
            socket.close();
        };
    }, []);

    const setNewMessageReceived = (fn: (message: any) => void) => {
        newMessageReceivedRef.current = fn;
    };

    return (
        <WebSocketContext.Provider value={{ setNewMessageReceived }}>
            {children}
        </WebSocketContext.Provider>
    );
}

export function useWebsocket() {
    const ctx = useContext(WebSocketContext);
    if (!ctx) {
        throw new Error('useWebsocket must be used within a WebSocketContextProvider');
    }
    return ctx;
}
