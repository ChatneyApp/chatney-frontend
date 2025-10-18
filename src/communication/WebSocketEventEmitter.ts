import { MessageWithUser } from '@/types/messages';

export type MessageDeletedPayload = {
    messageId: string;
    channelId: string;
};
export type WebSocketMessagePayload = MessageWithUser | MessageDeletedPayload;

export enum WebSocketEventType {
    NEW_MESSAGE = 'newMessage',
    DELETED_MESSAGE = 'deletedMessage',
}

export type WebSocketEventRaw = {
    type: WebSocketEventType.NEW_MESSAGE;
    payload: MessageWithUser;
} | {
    type: WebSocketEventType.DELETED_MESSAGE;
    payload: MessageDeletedPayload;
}

export class WebSocketEvent extends Event {
    readonly payload: WebSocketMessagePayload;
    constructor(type: WebSocketEventType, payload: WebSocketMessagePayload) {
        super(type);
        this.payload = payload;
    }
}

export class WebSocketEventEmitter extends EventTarget {
    addEventListener(
        type: WebSocketEventType,
        callback: (ev: WebSocketEvent) => void,
        options?: boolean | AddEventListenerOptions
    ): void;
    addEventListener(
        type: string,
        callback: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions
    ): void;
    addEventListener(
        type: WebSocketEventType | string,
        callback: ((ev: WebSocketEvent) => void) | EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions
    ): void {
        super.addEventListener(type, callback as EventListener, options);
    }

    removeEventListener(
        type: WebSocketEventType,
        callback: (ev: WebSocketEvent) => void,
        options?: boolean | EventListenerOptions
    ): void;
    removeEventListener(
        type: string,
        callback: EventListenerOrEventListenerObject,
        options?: boolean | EventListenerOptions
    ): void;
    removeEventListener(
        type: WebSocketEventType | string,
        callback: ((ev: WebSocketEvent) => void) | EventListenerOrEventListenerObject,
        options?: boolean | EventListenerOptions
    ): void {
        super.removeEventListener(type, callback as EventListener, options);
    }

    // Convenience: ensures you pass an instance of the right Event subclass.
    dispatchEvent(evt: WebSocketEvent): boolean {
        // NOTE: the event must have the matching type set in its constructor (super(type))
        return super.dispatchEvent(evt);
    }
}
