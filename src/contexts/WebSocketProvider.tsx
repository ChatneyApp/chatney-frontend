import { createContext, ReactNode, useCallback, useContext, useEffect, useRef } from 'react';

import { useUser } from './UserContext';
import { WebSocketEvent, WebSocketEventEmitter, WebSocketEventRaw } from '@/communication/WebSocketEventEmitter';

export interface WebSocketContext {
    eventEmitter: WebSocketEventEmitter;
}

export const WebSocketContext = createContext<WebSocketContext>(null as unknown as WebSocketContext);

export function WebSocketContextProvider({ children }: { children: ReactNode }) {
    const userCtx = useUser();
    const eventEmitter = useRef(new WebSocketEventEmitter());
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

        ws.addEventListener('message', (event: MessageEvent<string>) => {
            try {
                const message = JSON.parse(event.data) as WebSocketEventRaw;
                const { type, payload } = message;
                eventEmitter.current.dispatchEvent(new WebSocketEvent(type, payload));
            } catch (err) {
                console.error('WebSocket error', err);
            }
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

    return (
        <WebSocketContext.Provider value={{ eventEmitter: eventEmitter.current }}>
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
