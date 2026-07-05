import { MessageId, MessageWithUser, ReplyToMessage } from '@/types/messages';
import { UserId } from '@/types/users';
import { Channel, ChannelId } from '@/types/channels';
import { ChannelType, ChannelTypeId } from '@/types/channelTypes';
import { Workspace, WorkspaceId } from '@/types/workspaces';
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
    isProtected: boolean;
};
export type RoleDeletedPayload = {
    id: RoleId;
};
export type UserRolePayload = {
    userId: UserId;
    roleId: RoleId;
    channelId: ChannelId | null;
    channelTypeId: number | null;
    workspaceId: number | null;
    allowlist: string[];
    denylist: string[];
};
export type UserRoleDeletedPayload = {
    userId: UserId;
    channelId: ChannelId | null;
    channelTypeId: number | null;
    workspaceId: number | null;
};
export type ChannelPayload = Channel;
export type ChannelDeletedPayload = {
    id: ChannelId;
    workspaceId: WorkspaceId;
};
export type ChannelTypePayload = ChannelType;
export type ChannelTypeDeletedPayload = {
    id: ChannelTypeId;
};
export type WorkspacePayload = Workspace;
export type WorkspaceDeletedPayload = {
    id: WorkspaceId;
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
    RoleDeletedPayload |
    UserRolePayload |
    UserRoleDeletedPayload |
    ChannelPayload |
    ChannelDeletedPayload |
    ChannelTypePayload |
    ChannelTypeDeletedPayload |
    WorkspacePayload |
    WorkspaceDeletedPayload;

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
    NEW_USER_ROLE = 'newUserRole',
    UPDATED_USER_ROLE = 'updatedUserRole',
    DELETED_USER_ROLE = 'deletedUserRole',
    NEW_CHANNEL = 'newChannel',
    UPDATED_CHANNEL = 'updatedChannel',
    DELETED_CHANNEL = 'deletedChannel',
    NEW_CHANNEL_TYPE = 'newChannelType',
    UPDATED_CHANNEL_TYPE = 'updatedChannelType',
    DELETED_CHANNEL_TYPE = 'deletedChannelType',
    NEW_WORKSPACE = 'newWorkspace',
    UPDATED_WORKSPACE = 'updatedWorkspace',
    DELETED_WORKSPACE = 'deletedWorkspace',
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
} | {
    type: WebSocketEventType.NEW_USER_ROLE | WebSocketEventType.UPDATED_USER_ROLE;
    payload: UserRolePayload;
} | {
    type: WebSocketEventType.DELETED_USER_ROLE;
    payload: UserRoleDeletedPayload;
} | {
    type: WebSocketEventType.NEW_CHANNEL | WebSocketEventType.UPDATED_CHANNEL;
    payload: ChannelPayload;
} | {
    type: WebSocketEventType.DELETED_CHANNEL;
    payload: ChannelDeletedPayload;
} | {
    type: WebSocketEventType.NEW_CHANNEL_TYPE | WebSocketEventType.UPDATED_CHANNEL_TYPE;
    payload: ChannelTypePayload;
} | {
    type: WebSocketEventType.DELETED_CHANNEL_TYPE;
    payload: ChannelTypeDeletedPayload;
} | {
    type: WebSocketEventType.NEW_WORKSPACE | WebSocketEventType.UPDATED_WORKSPACE;
    payload: WorkspacePayload;
} | {
    type: WebSocketEventType.DELETED_WORKSPACE;
    payload: WorkspaceDeletedPayload;
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
