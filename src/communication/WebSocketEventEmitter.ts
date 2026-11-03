import type { WebSocketEvents } from './generated/websocket';

export type WebSocketEventType = keyof WebSocketEvents;

export type WebSocketEventRaw = {
    [K in WebSocketEventType]: { type: K; payload: WebSocketEvents[K] };
}[WebSocketEventType];

export class WebSocketEvent<K extends WebSocketEventType = WebSocketEventType> extends Event {
    declare readonly type: K;
    readonly payload: WebSocketEvents[K];

    constructor(type: K, payload: WebSocketEvents[K]) {
        super(type);
        this.payload = payload;
    }
}

// Spreads a union of event types into a union of events, so `switch (event.type)` narrows the payload.
export type WebSocketEventOf<K extends WebSocketEventType> = { [P in K]: WebSocketEvent<P> }[K];

export type ChannelChangedEvent = WebSocketEventOf<'newChannel' | 'updatedChannel' | 'deletedChannel'>;

// Wraps EventTarget instead of extending it: its addEventListener takes any string, so unknown event names would compile.
export class WebSocketEventEmitter {
    private readonly target = new EventTarget();

    addEventListener<K extends WebSocketEventType>(
        type: K,
        callback: (event: WebSocketEventOf<K>) => void,
        options?: boolean | AddEventListenerOptions
    ): void {
        this.target.addEventListener(type, callback as EventListener, options);
    }

    removeEventListener<K extends WebSocketEventType>(
        type: K,
        callback: (event: WebSocketEventOf<K>) => void,
        options?: boolean | EventListenerOptions
    ): void {
        this.target.removeEventListener(type, callback as EventListener, options);
    }

    dispatchEvent(event: WebSocketEvent): boolean {
        return this.target.dispatchEvent(event);
    }
}
