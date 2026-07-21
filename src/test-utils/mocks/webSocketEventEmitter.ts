import { WebSocketEventEmitter } from '@/communication/WebSocketEventEmitter';

/** Inert WebSocketEventEmitter instance to satisfy props that require one; stories can dispatchEvent on it manually if needed. */
export const createMockEventEmitter = () => new WebSocketEventEmitter();
