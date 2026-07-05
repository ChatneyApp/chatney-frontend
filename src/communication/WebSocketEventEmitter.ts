import { MessageId, MessageWithUser, ReplyToMessage } from '@/types/messages';
import { UserId } from '@/types/users';
import { ChannelId } from '@/types/channels';
import { RoleId } from '@/types/roles';

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
export type EditedMessagePayload = {
    message: MessageWithUser;
};
export type RolePayload = {
    id: RoleId;
    name: string;
    permissions: string[];
    isBase: boolean;
};
export type RoleDeletedPayload = {
    id: RoleId;
};
export type NewMessagePayload = {
    message: MessageWithUser;
    replyTo: ReplyToMessage | null;
};

export type WebSocketMessagePayload =
    NewMessagePayload |
    MessageDeletedPayload |
    ReactionChangedPayload |
    MessageChildrenCountUpdatedPayload |
    EditedMessagePayload |
    RolePayload |
    RoleDeletedPayload;

export enum WebSocketEventType {
    NEW_MESSAGE = 'newMessage',
    DELETED_MESSAGE = 'deletedMessage',
    NEW_REACTION = 'newReaction',
    DELETED_REACTION = 'deletedReaction',
    MESSAGE_CHILDREN_COUNT_UPDATED = 'messageChildrenCountUpdated',
    EDITED_MESSAGE = 'editedMessage',
    NEW_ROLE = 'newRole',
    UPDATED_ROLE = 'updatedRole',
    DELETED_ROLE = 'deletedRole',
}

export type WebSocketEventRaw = {
    type: WebSocketEventType.NEW_MESSAGE;
    payload: NewMessagePayload;
} | {
    type: WebSocketEventType.DELETED_MESSAGE;
    payload: MessageDeletedPayload;
} | {
    type: WebSocketEventType.NEW_REACTION | WebSocketEventType.DELETED_REACTION;
    payload: ReactionChangedPayload;
} | {
    type: WebSocketEventType.MESSAGE_CHILDREN_COUNT_UPDATED;
    payload: MessageChildrenCountUpdatedPayload;
} | {
    type: WebSocketEventType.EDITED_MESSAGE;
    payload: EditedMessagePayload;
} | {
    type: WebSocketEventType.NEW_ROLE | WebSocketEventType.UPDATED_ROLE;
    payload: RolePayload;
} | {
    type: WebSocketEventType.DELETED_ROLE;
    payload: RoleDeletedPayload;
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
