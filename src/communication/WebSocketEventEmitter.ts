import { MessageId, MessageWithUser } from '@/types/messages';
import { UserId } from '@/types/users';
import { ChannelId } from '@/types/channels';

export type MessageDeletedPayload = {
    messageId: MessageId;
    channelId: ChannelId;
};

export type ReactionChangedPayload = {
    code: string;
    messageId: MessageId;
    channelId: ChannelId;
    userId: UserId;
}
export type MessageChildrenCountUpdatedPayload = {
    messageId: MessageId;
    childrenCount: number;
}
export type WebSocketMessagePayload =
    MessageWithUser |
    MessageDeletedPayload |
    ReactionChangedPayload |
    MessageChildrenCountUpdatedPayload;

export enum WebSocketEventType {
    NEW_MESSAGE = 'newMessage',
    DELETED_MESSAGE = 'deletedMessage',
    NEW_REACTION = 'newReaction',
    DELETED_REACTION = 'deletedReaction',
    MESSAGE_CHILDREN_COUNT_UPDATED = 'messageChildrenCountUpdated',
}

export type WebSocketEventRaw = {
    type: WebSocketEventType.NEW_MESSAGE;
    payload: MessageWithUser;
} | {
    type: WebSocketEventType.DELETED_MESSAGE;
    payload: MessageDeletedPayload;
} | {
    type: WebSocketEventType.NEW_REACTION | WebSocketEventType.DELETED_REACTION;
    payload: ReactionChangedPayload;
} | {
    type: WebSocketEventType.MESSAGE_CHILDREN_COUNT_UPDATED;
    payload: MessageChildrenCountUpdatedPayload;
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
