import { createContext, ReactNode, useCallback, useContext, useEffect, useRef } from 'react';

import { useUser } from './UserContext';
import { MessageWithUser } from '@/types/messages';

type WebSocketMessage = MessageWithUser;
export interface INewMessageCallback {
    (message: WebSocketMessage): void;
}
export interface ISetNewMessageReceived {
    (fn: INewMessageCallback): void;
}
export interface WebSocketContext {
    setNewMessageReceived: ISetNewMessageReceived;
}

export const WebSocketContext = createContext<WebSocketContext>(null as unknown as WebSocketContext);

export function WebSocketContextProvider({ children }: { children: ReactNode }) {
    const userCtx = useUser();
    const newMessageReceivedRef = useRef<INewMessageCallback>(() => { });
    const abortControllerRef = useRef(new AbortController());
    const webSocketRef = useRef<WebSocket | null>(null);
    const userId = userCtx?.user?.id ?? null;
    console.log('WSContext - userId', userId);

    const connect = useCallback(() => {
        if (!userId) {
            return;
        }

        console.log('connecting to websocket...');

        const url = new URL(`${import.meta.env.VITE_WEBSOCKET_URL}`);
        const deviceId = sessionStorage.getItem('deviceId')!;
        url.searchParams.set('userId', `${userId}--${deviceId}`);

        const ws = new WebSocket(url);
        webSocketRef.current = ws;

        abortControllerRef.current = new AbortController();
        const { signal } = abortControllerRef.current;
        ws.addEventListener('open', () => {
            console.log('WebSocket connected');
        }, { signal });

        ws.addEventListener('message', (event) => {
            const message = JSON.parse(event.data);
            newMessageReceivedRef.current(message);
        }, { signal });

        ws.addEventListener('error', (event) => {
            console.error('WebSocket error:', event);
        }, { signal });

        ws.addEventListener('close', () => {
            console.log('WebSocket closed');
        }, { signal });
    }, [ userId ]);

    const close = useCallback(() => {
        abortControllerRef.current.abort();
        if (webSocketRef.current) {
            webSocketRef.current.close();
            webSocketRef.current = null;
        }
    }, []);

    useEffect(() => {
        connect();
        return close;
    }, [ userId ]);

    const setNewMessageReceived = (fn: INewMessageCallback) => {
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
