import { useRef } from 'react';

export const useWebsocket = (userId: string) => {
    console.log('useWebsocket');
    const url = new URL(`${import.meta.env.VITE_WEBSOCKET_URL}`);
    url.searchParams.set('userId', userId);

    const socket = useRef(new WebSocket(url.toString()));
    const disconnect = () => {
        socket.current.close();
    };

    return {
        socket: socket.current,
        disconnect,
    }
};
