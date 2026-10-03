/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n    query GetUsersList($filter: UserFilterInput!) {\n        users {\n            list(filter: $filter) {\n                ...UserFields\n            }\n        }\n    }\n": typeof types.GetUsersListDocument,
    "\n    mutation CreateUser($userDto: CreateUserDtoInput!) {\n        users {\n            createUser(userDto: $userDto) {\n                ...UserFields\n            }\n        }\n    }\n": typeof types.CreateUserDocument,
    "\n    mutation UpdateUser($userDto: UpdateUserDtoInput!) {\n        users {\n            updateUser(userDto: $userDto) {\n                ...UserFields\n            }\n        }\n    }\n": typeof types.UpdateUserDocument,
    "\n    mutation DeleteUser($id: UUID!) {\n        users {\n            deleteUser(id: $id)\n        }\n    }\n": typeof types.DeleteUserDocument,
    "\n    fragment AttachmentFields on Attachment {\n        id\n        userId\n        urlPath\n        originalFileName\n        extension\n        mimeType\n        size\n        type\n        asFile\n        width\n        height\n        duration\n        createdAt\n        updatedAt\n    }\n": typeof types.AttachmentFieldsFragmentDoc,
    "\n    mutation UploadFile($file: Upload!, $asFile: Boolean!, $width: Int, $height: Int, $duration: Int) {\n        attachments {\n            upload(file: $file, asFile: $asFile, width: $width, height: $height, duration: $duration) {\n                ...AttachmentFields\n            }\n        }\n    }\n": typeof types.UploadFileDocument,
    "\n    mutation Login($login: String!, $password: String!) {\n        users {\n            login(login: $login, password: $password) {\n                id\n                token\n            }\n        }\n    }\n": typeof types.LoginDocument,
    "\n    mutation RegisterUser($input: UserRegisterDtoInput!) {\n        users {\n            register(userDto: $input) {\n                id\n                nickname\n                fullName\n                email\n            }\n        }\n    }\n": typeof types.RegisterUserDocument,
    "\n    fragment ChannelGroupFields on ChannelGroup {\n        id\n        name\n        workspaceId\n        channelIds\n        order\n        createdAt\n        updatedAt\n    }\n": typeof types.ChannelGroupFieldsFragmentDoc,
    "\n    mutation CreateChannelGroup($channelGroupDto: ChannelGroupDtoInput!) {\n        channels {\n            addChannelGroup(channelGroupDto: $channelGroupDto) {\n                ...ChannelGroupFields\n            }\n        }\n    }\n": typeof types.CreateChannelGroupDocument,
    "\n    mutation UpdateChannelGroup($channelGroup: ChannelGroupInput!) {\n        channels {\n            updateChannelGroup(channelGroup: $channelGroup) {\n                ...ChannelGroupFields\n            }\n        }\n    }\n": typeof types.UpdateChannelGroupDocument,
    "\n    mutation DeleteChannelGroup($id: Int!) {\n        channels {\n            deleteChannelGroup(id: $id)\n        }\n    }\n": typeof types.DeleteChannelGroupDocument,
    "\n    query GetWorkspaceChannelGroups($workspaceId: Int!) {\n        channels {\n            workspaceChannelGroupList(workspaceId: $workspaceId) {\n                ...ChannelGroupFields\n            }\n        }\n    }\n": typeof types.GetWorkspaceChannelGroupsDocument,
    "\n    fragment ChannelTypeFields on ChannelType {\n        id\n        name\n        key\n        secObjId\n        createdAt\n        updatedAt\n    }\n": typeof types.ChannelTypeFieldsFragmentDoc,
    "\n    mutation CreateChannelType($channelTypeDto: ChannelTypeDtoInput!) {\n        channels {\n            addChannelType(channelTypeDto: $channelTypeDto) {\n                ...ChannelTypeFields\n            }\n        }\n    }\n": typeof types.CreateChannelTypeDocument,
    "\n    mutation UpdateChannelType($channelType: ChannelTypeInput!) {\n        channels {\n            updateChannelType(channelType: $channelType) {\n                ...ChannelTypeFields\n            }\n        }\n    }\n": typeof types.UpdateChannelTypeDocument,
    "\n    mutation DeleteChannelType($id: Int!) {\n        channels {\n            deleteChannelType(id: $id)\n        }\n    }\n": typeof types.DeleteChannelTypeDocument,
    "\n    query GetChannelTypes {\n        channels {\n            channelTypeList {\n                ...ChannelTypeFields\n            }\n        }\n    }\n": typeof types.GetChannelTypesDocument,
    "\n    fragment ChannelFields on Channel {\n        id\n        name\n        channelTypeId\n        workspaceId\n        isDm\n        secObjId\n        createdAt\n        updatedAt\n    }\n": typeof types.ChannelFieldsFragmentDoc,
    "\n    query GetWorkspaceChannels($workspaceId: Int!) {\n        channels {\n            workspaceChannelList(workspaceId: $workspaceId) {\n                ...ChannelFields\n            }\n        }\n    }\n": typeof types.GetWorkspaceChannelsDocument,
    "\n    mutation CreateChannel($channelDto: ChannelDtoInput!) {\n        channels {\n            addChannel(channelDto: $channelDto) {\n                ...ChannelFields\n            }\n        }\n    }\n": typeof types.CreateChannelDocument,
    "\n    mutation AddChannel(\n        $name: String!\n        $channelTypeId: Int!\n        $workspaceId: Int!\n    ) {\n        channels {\n            addChannel(channelDto: {\n                name: $name\n                channelTypeId: $channelTypeId\n                workspaceId: $workspaceId\n            }) {\n                ...ChannelFields\n            }\n        }\n    }\n": typeof types.AddChannelDocument,
    "\n    mutation UpdateChannel($channel: ChannelInput!) {\n        channels {\n            updateChannel(channel: $channel) {\n                ...ChannelFields\n            }\n        }\n    }\n": typeof types.UpdateChannelDocument,
    "\n    mutation DeleteChannel($id: Int!) {\n        channels {\n            deleteChannel(id: $id)\n        }\n    }\n": typeof types.DeleteChannelDocument,
    "\n    fragment DirectMessageUserFields on DirectMessageUser {\n        id\n        nickname\n        avatarUrl\n    }\n": typeof types.DirectMessageUserFieldsFragmentDoc,
    "\n    fragment DirectMessageFields on DirectMessage {\n        channel {\n            ...ChannelFields\n        }\n        otherUsers {\n            ...DirectMessageUserFields\n        }\n    }\n": typeof types.DirectMessageFieldsFragmentDoc,
    "\n    query GetDirectMessages {\n        channels {\n            directMessageList {\n                ...DirectMessageFields\n            }\n        }\n    }\n": typeof types.GetDirectMessagesDocument,
    "\n    mutation OpenDirectMessage($otherUserIds: [UUID!]!) {\n        channels {\n            openDirectMessage(otherUserIds: $otherUserIds) {\n                ...DirectMessageFields\n            }\n        }\n    }\n": typeof types.OpenDirectMessageDocument,
    "\n    fragment UrlPreviewFields on UrlPreview {\n        id\n        createdAt\n        updatedAt\n        url\n        title\n        description\n        thumbnailUrl\n        videoThumbnailUrl\n        siteName\n        favIconUrl\n        type\n        author\n        thumbnailWidth\n        thumbnailHeight\n    }\n": typeof types.UrlPreviewFieldsFragmentDoc,
    "\n    fragment MessageFields on MessageWithUser {\n        id\n        channelId\n        userId\n        user {\n            id\n            nickname\n            fullName\n            displayName\n            avatarUrl\n        }\n        content\n        attachments {\n            ...AttachmentFields\n        }\n        status\n        createdAt\n        updatedAt\n        urlPreviews {\n            ...UrlPreviewFields\n        }\n        reactions {\n            code\n            count\n        }\n        myReactions\n        parentId\n        childrenCount\n        replyTo\n    }\n": typeof types.MessageFieldsFragmentDoc,
    "\n    fragment MessagesResultFields on MessagesResult {\n        messages {\n            ...MessageFields\n        }\n        refs {\n            id\n            userId\n            content\n        }\n    }\n": typeof types.MessagesResultFieldsFragmentDoc,
    "\n    mutation CreateMessage($messageDto: MessageDtoInput!) {\n        messages {\n            addMessage(messageDto: $messageDto) {\n                ...MessageFields\n            }\n        }\n    }\n": typeof types.CreateMessageDocument,
    "\n    mutation UpdateMessage($message: MessageUpdateDtoInput!) {\n        messages {\n            updateMessage(message: $message)\n        }\n    }\n": typeof types.UpdateMessageDocument,
    "\n    mutation DeleteMessage($id: Int!) {\n        messages {\n            deleteMessage(id: $id)\n        }\n    }\n": typeof types.DeleteMessageDocument,
    "\n    mutation AddReaction($code: String!, $messageId: Int!) {\n        messages {\n            addReaction(code: $code, messageId: $messageId) {\n                status\n                message\n            }\n        }\n    }\n": typeof types.AddReactionDocument,
    "\n    mutation DeleteReaction($code: String!, $messageId: Int!) {\n        messages {\n            deleteReaction(code: $code, messageId: $messageId) {\n                status\n                message\n            }\n        }\n    }\n": typeof types.DeleteReactionDocument,
    "\n    query GetChannelMessages($channelId: Int!) {\n        messages {\n            listChannelMessages(channelId: $channelId) {\n                ...MessagesResultFields\n            }\n        }\n    }\n": typeof types.GetChannelMessagesDocument,
    "\n    query GetThreadMessages($threadId: Int!) {\n        messages {\n            listThreadMessages(threadId: $threadId) {\n                ...MessagesResultFields\n            }\n        }\n    }\n": typeof types.GetThreadMessagesDocument,
    "\n    query GetPermissionsList {\n        permissions {\n            list {\n                label\n                list\n            }\n        }\n    }\n": typeof types.GetPermissionsListDocument,
    "\n    query GetMyProfile {\n        users {\n            myProfile {\n                roleNames\n                user {\n                    ...UserFields\n                }\n            }\n        }\n    }\n": typeof types.GetMyProfileDocument,
    "\n    mutation UpdateMyProfile($profileDto: UpdateMyProfileDtoInput!) {\n        users {\n            updateMyProfile(profileDto: $profileDto) {\n                ...UserFields\n            }\n        }\n    }\n": typeof types.UpdateMyProfileDocument,
    "\n    fragment RoleFields on Role {\n        id\n        name\n        createdAt\n        updatedAt\n    }\n": typeof types.RoleFieldsFragmentDoc,
    "\n    mutation CreateRole($roleDto: RoleCreateDtoInput!) {\n        roles {\n            addRole(roleDto: $roleDto) {\n                ...RoleFields\n            }\n        }\n    }\n": typeof types.CreateRoleDocument,
    "\n    mutation UpdateRole($roleDto: RoleUpdateDtoInput!) {\n        roles {\n            updateRole(roleDto: $roleDto) {\n                ...RoleFields\n            }\n        }\n    }\n": typeof types.UpdateRoleDocument,
    "\n    mutation DeleteRole($id: Int!) {\n        roles {\n            deleteRole(id: $id)\n        }\n    }\n": typeof types.DeleteRoleDocument,
    "\n    query GetRoles {\n        roles {\n            list {\n                ...RoleFields\n            }\n        }\n    }\n": typeof types.GetRolesDocument,
    "\n    fragment ConfigFields on Config {\n        id\n        name\n        value\n        type\n    }\n": typeof types.ConfigFieldsFragmentDoc,
    "\n    mutation UpdateSystemConfigValue($config: ConfigInput!) {\n        configs {\n            updateConfig(config: $config) {\n                ...ConfigFields\n            }\n        }\n    }\n": typeof types.UpdateSystemConfigValueDocument,
    "\n    query GetSystemConfig {\n        configs {\n            list {\n                ...ConfigFields\n            }\n        }\n    }\n": typeof types.GetSystemConfigDocument,
    "\n    mutation InstallSystem {\n        installWizard {\n            installSystem {\n                status\n                message\n            }\n        }\n    }\n": typeof types.InstallSystemDocument,
    "\n    fragment UserFields on User {\n        id\n        nickname\n        fullName\n        active\n        verified\n        banned\n        muted\n        email\n        avatarUrl\n    }\n": typeof types.UserFieldsFragmentDoc,
    "\n    query GetUserById($id: UUID!) {\n        users {\n            userById(id: $id) {\n                ...UserFields\n            }\n        }\n    }\n": typeof types.GetUserByIdDocument,
    "\n    query SearchUsersByNickname($prefix: String!) {\n        users {\n            searchByNickname(prefix: $prefix) {\n                ...DirectMessageUserFields\n            }\n        }\n    }\n": typeof types.SearchUsersByNicknameDocument,
    "\n    fragment WorkspaceFields on Workspace {\n        id\n        name\n        secObjId\n        createdAt\n        updatedAt\n    }\n": typeof types.WorkspaceFieldsFragmentDoc,
    "\n    mutation AddWorkspace($name: String!) {\n        workspaces {\n            addWorkspace(workspaceDto: { name: $name }) {\n                ...WorkspaceFields\n            }\n        }\n    }\n": typeof types.AddWorkspaceDocument,
    "\n    mutation UpdateWorkspace($workspace: WorkspaceInput!) {\n        workspaces {\n            updateWorkspace(workspace: $workspace) {\n                ...WorkspaceFields\n            }\n        }\n    }\n": typeof types.UpdateWorkspaceDocument,
    "\n    mutation DeleteWorkspace($id: Int!) {\n        workspaces {\n            deleteWorkspace(id: $id)\n        }\n    }\n": typeof types.DeleteWorkspaceDocument,
    "\n    query GetWorkspaces {\n        workspaces {\n            list {\n                ...WorkspaceFields\n            }\n        }\n    }\n": typeof types.GetWorkspacesDocument,
};
const documents: Documents = {
    "\n    query GetUsersList($filter: UserFilterInput!) {\n        users {\n            list(filter: $filter) {\n                ...UserFields\n            }\n        }\n    }\n": types.GetUsersListDocument,
    "\n    mutation CreateUser($userDto: CreateUserDtoInput!) {\n        users {\n            createUser(userDto: $userDto) {\n                ...UserFields\n            }\n        }\n    }\n": types.CreateUserDocument,
    "\n    mutation UpdateUser($userDto: UpdateUserDtoInput!) {\n        users {\n            updateUser(userDto: $userDto) {\n                ...UserFields\n            }\n        }\n    }\n": types.UpdateUserDocument,
    "\n    mutation DeleteUser($id: UUID!) {\n        users {\n            deleteUser(id: $id)\n        }\n    }\n": types.DeleteUserDocument,
    "\n    fragment AttachmentFields on Attachment {\n        id\n        userId\n        urlPath\n        originalFileName\n        extension\n        mimeType\n        size\n        type\n        asFile\n        width\n        height\n        duration\n        createdAt\n        updatedAt\n    }\n": types.AttachmentFieldsFragmentDoc,
    "\n    mutation UploadFile($file: Upload!, $asFile: Boolean!, $width: Int, $height: Int, $duration: Int) {\n        attachments {\n            upload(file: $file, asFile: $asFile, width: $width, height: $height, duration: $duration) {\n                ...AttachmentFields\n            }\n        }\n    }\n": types.UploadFileDocument,
    "\n    mutation Login($login: String!, $password: String!) {\n        users {\n            login(login: $login, password: $password) {\n                id\n                token\n            }\n        }\n    }\n": types.LoginDocument,
    "\n    mutation RegisterUser($input: UserRegisterDtoInput!) {\n        users {\n            register(userDto: $input) {\n                id\n                nickname\n                fullName\n                email\n            }\n        }\n    }\n": types.RegisterUserDocument,
    "\n    fragment ChannelGroupFields on ChannelGroup {\n        id\n        name\n        workspaceId\n        channelIds\n        order\n        createdAt\n        updatedAt\n    }\n": types.ChannelGroupFieldsFragmentDoc,
    "\n    mutation CreateChannelGroup($channelGroupDto: ChannelGroupDtoInput!) {\n        channels {\n            addChannelGroup(channelGroupDto: $channelGroupDto) {\n                ...ChannelGroupFields\n            }\n        }\n    }\n": types.CreateChannelGroupDocument,
    "\n    mutation UpdateChannelGroup($channelGroup: ChannelGroupInput!) {\n        channels {\n            updateChannelGroup(channelGroup: $channelGroup) {\n                ...ChannelGroupFields\n            }\n        }\n    }\n": types.UpdateChannelGroupDocument,
    "\n    mutation DeleteChannelGroup($id: Int!) {\n        channels {\n            deleteChannelGroup(id: $id)\n        }\n    }\n": types.DeleteChannelGroupDocument,
    "\n    query GetWorkspaceChannelGroups($workspaceId: Int!) {\n        channels {\n            workspaceChannelGroupList(workspaceId: $workspaceId) {\n                ...ChannelGroupFields\n            }\n        }\n    }\n": types.GetWorkspaceChannelGroupsDocument,
    "\n    fragment ChannelTypeFields on ChannelType {\n        id\n        name\n        key\n        secObjId\n        createdAt\n        updatedAt\n    }\n": types.ChannelTypeFieldsFragmentDoc,
    "\n    mutation CreateChannelType($channelTypeDto: ChannelTypeDtoInput!) {\n        channels {\n            addChannelType(channelTypeDto: $channelTypeDto) {\n                ...ChannelTypeFields\n            }\n        }\n    }\n": types.CreateChannelTypeDocument,
    "\n    mutation UpdateChannelType($channelType: ChannelTypeInput!) {\n        channels {\n            updateChannelType(channelType: $channelType) {\n                ...ChannelTypeFields\n            }\n        }\n    }\n": types.UpdateChannelTypeDocument,
    "\n    mutation DeleteChannelType($id: Int!) {\n        channels {\n            deleteChannelType(id: $id)\n        }\n    }\n": types.DeleteChannelTypeDocument,
    "\n    query GetChannelTypes {\n        channels {\n            channelTypeList {\n                ...ChannelTypeFields\n            }\n        }\n    }\n": types.GetChannelTypesDocument,
    "\n    fragment ChannelFields on Channel {\n        id\n        name\n        channelTypeId\n        workspaceId\n        isDm\n        secObjId\n        createdAt\n        updatedAt\n    }\n": types.ChannelFieldsFragmentDoc,
    "\n    query GetWorkspaceChannels($workspaceId: Int!) {\n        channels {\n            workspaceChannelList(workspaceId: $workspaceId) {\n                ...ChannelFields\n            }\n        }\n    }\n": types.GetWorkspaceChannelsDocument,
    "\n    mutation CreateChannel($channelDto: ChannelDtoInput!) {\n        channels {\n            addChannel(channelDto: $channelDto) {\n                ...ChannelFields\n            }\n        }\n    }\n": types.CreateChannelDocument,
    "\n    mutation AddChannel(\n        $name: String!\n        $channelTypeId: Int!\n        $workspaceId: Int!\n    ) {\n        channels {\n            addChannel(channelDto: {\n                name: $name\n                channelTypeId: $channelTypeId\n                workspaceId: $workspaceId\n            }) {\n                ...ChannelFields\n            }\n        }\n    }\n": types.AddChannelDocument,
    "\n    mutation UpdateChannel($channel: ChannelInput!) {\n        channels {\n            updateChannel(channel: $channel) {\n                ...ChannelFields\n            }\n        }\n    }\n": types.UpdateChannelDocument,
    "\n    mutation DeleteChannel($id: Int!) {\n        channels {\n            deleteChannel(id: $id)\n        }\n    }\n": types.DeleteChannelDocument,
    "\n    fragment DirectMessageUserFields on DirectMessageUser {\n        id\n        nickname\n        avatarUrl\n    }\n": types.DirectMessageUserFieldsFragmentDoc,
    "\n    fragment DirectMessageFields on DirectMessage {\n        channel {\n            ...ChannelFields\n        }\n        otherUsers {\n            ...DirectMessageUserFields\n        }\n    }\n": types.DirectMessageFieldsFragmentDoc,
    "\n    query GetDirectMessages {\n        channels {\n            directMessageList {\n                ...DirectMessageFields\n            }\n        }\n    }\n": types.GetDirectMessagesDocument,
    "\n    mutation OpenDirectMessage($otherUserIds: [UUID!]!) {\n        channels {\n            openDirectMessage(otherUserIds: $otherUserIds) {\n                ...DirectMessageFields\n            }\n        }\n    }\n": types.OpenDirectMessageDocument,
    "\n    fragment UrlPreviewFields on UrlPreview {\n        id\n        createdAt\n        updatedAt\n        url\n        title\n        description\n        thumbnailUrl\n        videoThumbnailUrl\n        siteName\n        favIconUrl\n        type\n        author\n        thumbnailWidth\n        thumbnailHeight\n    }\n": types.UrlPreviewFieldsFragmentDoc,
    "\n    fragment MessageFields on MessageWithUser {\n        id\n        channelId\n        userId\n        user {\n            id\n            nickname\n            fullName\n            displayName\n            avatarUrl\n        }\n        content\n        attachments {\n            ...AttachmentFields\n        }\n        status\n        createdAt\n        updatedAt\n        urlPreviews {\n            ...UrlPreviewFields\n        }\n        reactions {\n            code\n            count\n        }\n        myReactions\n        parentId\n        childrenCount\n        replyTo\n    }\n": types.MessageFieldsFragmentDoc,
    "\n    fragment MessagesResultFields on MessagesResult {\n        messages {\n            ...MessageFields\n        }\n        refs {\n            id\n            userId\n            content\n        }\n    }\n": types.MessagesResultFieldsFragmentDoc,
    "\n    mutation CreateMessage($messageDto: MessageDtoInput!) {\n        messages {\n            addMessage(messageDto: $messageDto) {\n                ...MessageFields\n            }\n        }\n    }\n": types.CreateMessageDocument,
    "\n    mutation UpdateMessage($message: MessageUpdateDtoInput!) {\n        messages {\n            updateMessage(message: $message)\n        }\n    }\n": types.UpdateMessageDocument,
    "\n    mutation DeleteMessage($id: Int!) {\n        messages {\n            deleteMessage(id: $id)\n        }\n    }\n": types.DeleteMessageDocument,
    "\n    mutation AddReaction($code: String!, $messageId: Int!) {\n        messages {\n            addReaction(code: $code, messageId: $messageId) {\n                status\n                message\n            }\n        }\n    }\n": types.AddReactionDocument,
    "\n    mutation DeleteReaction($code: String!, $messageId: Int!) {\n        messages {\n            deleteReaction(code: $code, messageId: $messageId) {\n                status\n                message\n            }\n        }\n    }\n": types.DeleteReactionDocument,
    "\n    query GetChannelMessages($channelId: Int!) {\n        messages {\n            listChannelMessages(channelId: $channelId) {\n                ...MessagesResultFields\n            }\n        }\n    }\n": types.GetChannelMessagesDocument,
    "\n    query GetThreadMessages($threadId: Int!) {\n        messages {\n            listThreadMessages(threadId: $threadId) {\n                ...MessagesResultFields\n            }\n        }\n    }\n": types.GetThreadMessagesDocument,
    "\n    query GetPermissionsList {\n        permissions {\n            list {\n                label\n                list\n            }\n        }\n    }\n": types.GetPermissionsListDocument,
    "\n    query GetMyProfile {\n        users {\n            myProfile {\n                roleNames\n                user {\n                    ...UserFields\n                }\n            }\n        }\n    }\n": types.GetMyProfileDocument,
    "\n    mutation UpdateMyProfile($profileDto: UpdateMyProfileDtoInput!) {\n        users {\n            updateMyProfile(profileDto: $profileDto) {\n                ...UserFields\n            }\n        }\n    }\n": types.UpdateMyProfileDocument,
    "\n    fragment RoleFields on Role {\n        id\n        name\n        createdAt\n        updatedAt\n    }\n": types.RoleFieldsFragmentDoc,
    "\n    mutation CreateRole($roleDto: RoleCreateDtoInput!) {\n        roles {\n            addRole(roleDto: $roleDto) {\n                ...RoleFields\n            }\n        }\n    }\n": types.CreateRoleDocument,
    "\n    mutation UpdateRole($roleDto: RoleUpdateDtoInput!) {\n        roles {\n            updateRole(roleDto: $roleDto) {\n                ...RoleFields\n            }\n        }\n    }\n": types.UpdateRoleDocument,
    "\n    mutation DeleteRole($id: Int!) {\n        roles {\n            deleteRole(id: $id)\n        }\n    }\n": types.DeleteRoleDocument,
    "\n    query GetRoles {\n        roles {\n            list {\n                ...RoleFields\n            }\n        }\n    }\n": types.GetRolesDocument,
    "\n    fragment ConfigFields on Config {\n        id\n        name\n        value\n        type\n    }\n": types.ConfigFieldsFragmentDoc,
    "\n    mutation UpdateSystemConfigValue($config: ConfigInput!) {\n        configs {\n            updateConfig(config: $config) {\n                ...ConfigFields\n            }\n        }\n    }\n": types.UpdateSystemConfigValueDocument,
    "\n    query GetSystemConfig {\n        configs {\n            list {\n                ...ConfigFields\n            }\n        }\n    }\n": types.GetSystemConfigDocument,
    "\n    mutation InstallSystem {\n        installWizard {\n            installSystem {\n                status\n                message\n            }\n        }\n    }\n": types.InstallSystemDocument,
    "\n    fragment UserFields on User {\n        id\n        nickname\n        fullName\n        active\n        verified\n        banned\n        muted\n        email\n        avatarUrl\n    }\n": types.UserFieldsFragmentDoc,
    "\n    query GetUserById($id: UUID!) {\n        users {\n            userById(id: $id) {\n                ...UserFields\n            }\n        }\n    }\n": types.GetUserByIdDocument,
    "\n    query SearchUsersByNickname($prefix: String!) {\n        users {\n            searchByNickname(prefix: $prefix) {\n                ...DirectMessageUserFields\n            }\n        }\n    }\n": types.SearchUsersByNicknameDocument,
    "\n    fragment WorkspaceFields on Workspace {\n        id\n        name\n        secObjId\n        createdAt\n        updatedAt\n    }\n": types.WorkspaceFieldsFragmentDoc,
    "\n    mutation AddWorkspace($name: String!) {\n        workspaces {\n            addWorkspace(workspaceDto: { name: $name }) {\n                ...WorkspaceFields\n            }\n        }\n    }\n": types.AddWorkspaceDocument,
    "\n    mutation UpdateWorkspace($workspace: WorkspaceInput!) {\n        workspaces {\n            updateWorkspace(workspace: $workspace) {\n                ...WorkspaceFields\n            }\n        }\n    }\n": types.UpdateWorkspaceDocument,
    "\n    mutation DeleteWorkspace($id: Int!) {\n        workspaces {\n            deleteWorkspace(id: $id)\n        }\n    }\n": types.DeleteWorkspaceDocument,
    "\n    query GetWorkspaces {\n        workspaces {\n            list {\n                ...WorkspaceFields\n            }\n        }\n    }\n": types.GetWorkspacesDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetUsersList($filter: UserFilterInput!) {\n        users {\n            list(filter: $filter) {\n                ...UserFields\n            }\n        }\n    }\n"): (typeof documents)["\n    query GetUsersList($filter: UserFilterInput!) {\n        users {\n            list(filter: $filter) {\n                ...UserFields\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation CreateUser($userDto: CreateUserDtoInput!) {\n        users {\n            createUser(userDto: $userDto) {\n                ...UserFields\n            }\n        }\n    }\n"): (typeof documents)["\n    mutation CreateUser($userDto: CreateUserDtoInput!) {\n        users {\n            createUser(userDto: $userDto) {\n                ...UserFields\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation UpdateUser($userDto: UpdateUserDtoInput!) {\n        users {\n            updateUser(userDto: $userDto) {\n                ...UserFields\n            }\n        }\n    }\n"): (typeof documents)["\n    mutation UpdateUser($userDto: UpdateUserDtoInput!) {\n        users {\n            updateUser(userDto: $userDto) {\n                ...UserFields\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation DeleteUser($id: UUID!) {\n        users {\n            deleteUser(id: $id)\n        }\n    }\n"): (typeof documents)["\n    mutation DeleteUser($id: UUID!) {\n        users {\n            deleteUser(id: $id)\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment AttachmentFields on Attachment {\n        id\n        userId\n        urlPath\n        originalFileName\n        extension\n        mimeType\n        size\n        type\n        asFile\n        width\n        height\n        duration\n        createdAt\n        updatedAt\n    }\n"): (typeof documents)["\n    fragment AttachmentFields on Attachment {\n        id\n        userId\n        urlPath\n        originalFileName\n        extension\n        mimeType\n        size\n        type\n        asFile\n        width\n        height\n        duration\n        createdAt\n        updatedAt\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation UploadFile($file: Upload!, $asFile: Boolean!, $width: Int, $height: Int, $duration: Int) {\n        attachments {\n            upload(file: $file, asFile: $asFile, width: $width, height: $height, duration: $duration) {\n                ...AttachmentFields\n            }\n        }\n    }\n"): (typeof documents)["\n    mutation UploadFile($file: Upload!, $asFile: Boolean!, $width: Int, $height: Int, $duration: Int) {\n        attachments {\n            upload(file: $file, asFile: $asFile, width: $width, height: $height, duration: $duration) {\n                ...AttachmentFields\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation Login($login: String!, $password: String!) {\n        users {\n            login(login: $login, password: $password) {\n                id\n                token\n            }\n        }\n    }\n"): (typeof documents)["\n    mutation Login($login: String!, $password: String!) {\n        users {\n            login(login: $login, password: $password) {\n                id\n                token\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation RegisterUser($input: UserRegisterDtoInput!) {\n        users {\n            register(userDto: $input) {\n                id\n                nickname\n                fullName\n                email\n            }\n        }\n    }\n"): (typeof documents)["\n    mutation RegisterUser($input: UserRegisterDtoInput!) {\n        users {\n            register(userDto: $input) {\n                id\n                nickname\n                fullName\n                email\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment ChannelGroupFields on ChannelGroup {\n        id\n        name\n        workspaceId\n        channelIds\n        order\n        createdAt\n        updatedAt\n    }\n"): (typeof documents)["\n    fragment ChannelGroupFields on ChannelGroup {\n        id\n        name\n        workspaceId\n        channelIds\n        order\n        createdAt\n        updatedAt\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation CreateChannelGroup($channelGroupDto: ChannelGroupDtoInput!) {\n        channels {\n            addChannelGroup(channelGroupDto: $channelGroupDto) {\n                ...ChannelGroupFields\n            }\n        }\n    }\n"): (typeof documents)["\n    mutation CreateChannelGroup($channelGroupDto: ChannelGroupDtoInput!) {\n        channels {\n            addChannelGroup(channelGroupDto: $channelGroupDto) {\n                ...ChannelGroupFields\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation UpdateChannelGroup($channelGroup: ChannelGroupInput!) {\n        channels {\n            updateChannelGroup(channelGroup: $channelGroup) {\n                ...ChannelGroupFields\n            }\n        }\n    }\n"): (typeof documents)["\n    mutation UpdateChannelGroup($channelGroup: ChannelGroupInput!) {\n        channels {\n            updateChannelGroup(channelGroup: $channelGroup) {\n                ...ChannelGroupFields\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation DeleteChannelGroup($id: Int!) {\n        channels {\n            deleteChannelGroup(id: $id)\n        }\n    }\n"): (typeof documents)["\n    mutation DeleteChannelGroup($id: Int!) {\n        channels {\n            deleteChannelGroup(id: $id)\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetWorkspaceChannelGroups($workspaceId: Int!) {\n        channels {\n            workspaceChannelGroupList(workspaceId: $workspaceId) {\n                ...ChannelGroupFields\n            }\n        }\n    }\n"): (typeof documents)["\n    query GetWorkspaceChannelGroups($workspaceId: Int!) {\n        channels {\n            workspaceChannelGroupList(workspaceId: $workspaceId) {\n                ...ChannelGroupFields\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment ChannelTypeFields on ChannelType {\n        id\n        name\n        key\n        secObjId\n        createdAt\n        updatedAt\n    }\n"): (typeof documents)["\n    fragment ChannelTypeFields on ChannelType {\n        id\n        name\n        key\n        secObjId\n        createdAt\n        updatedAt\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation CreateChannelType($channelTypeDto: ChannelTypeDtoInput!) {\n        channels {\n            addChannelType(channelTypeDto: $channelTypeDto) {\n                ...ChannelTypeFields\n            }\n        }\n    }\n"): (typeof documents)["\n    mutation CreateChannelType($channelTypeDto: ChannelTypeDtoInput!) {\n        channels {\n            addChannelType(channelTypeDto: $channelTypeDto) {\n                ...ChannelTypeFields\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation UpdateChannelType($channelType: ChannelTypeInput!) {\n        channels {\n            updateChannelType(channelType: $channelType) {\n                ...ChannelTypeFields\n            }\n        }\n    }\n"): (typeof documents)["\n    mutation UpdateChannelType($channelType: ChannelTypeInput!) {\n        channels {\n            updateChannelType(channelType: $channelType) {\n                ...ChannelTypeFields\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation DeleteChannelType($id: Int!) {\n        channels {\n            deleteChannelType(id: $id)\n        }\n    }\n"): (typeof documents)["\n    mutation DeleteChannelType($id: Int!) {\n        channels {\n            deleteChannelType(id: $id)\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetChannelTypes {\n        channels {\n            channelTypeList {\n                ...ChannelTypeFields\n            }\n        }\n    }\n"): (typeof documents)["\n    query GetChannelTypes {\n        channels {\n            channelTypeList {\n                ...ChannelTypeFields\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment ChannelFields on Channel {\n        id\n        name\n        channelTypeId\n        workspaceId\n        isDm\n        secObjId\n        createdAt\n        updatedAt\n    }\n"): (typeof documents)["\n    fragment ChannelFields on Channel {\n        id\n        name\n        channelTypeId\n        workspaceId\n        isDm\n        secObjId\n        createdAt\n        updatedAt\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetWorkspaceChannels($workspaceId: Int!) {\n        channels {\n            workspaceChannelList(workspaceId: $workspaceId) {\n                ...ChannelFields\n            }\n        }\n    }\n"): (typeof documents)["\n    query GetWorkspaceChannels($workspaceId: Int!) {\n        channels {\n            workspaceChannelList(workspaceId: $workspaceId) {\n                ...ChannelFields\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation CreateChannel($channelDto: ChannelDtoInput!) {\n        channels {\n            addChannel(channelDto: $channelDto) {\n                ...ChannelFields\n            }\n        }\n    }\n"): (typeof documents)["\n    mutation CreateChannel($channelDto: ChannelDtoInput!) {\n        channels {\n            addChannel(channelDto: $channelDto) {\n                ...ChannelFields\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation AddChannel(\n        $name: String!\n        $channelTypeId: Int!\n        $workspaceId: Int!\n    ) {\n        channels {\n            addChannel(channelDto: {\n                name: $name\n                channelTypeId: $channelTypeId\n                workspaceId: $workspaceId\n            }) {\n                ...ChannelFields\n            }\n        }\n    }\n"): (typeof documents)["\n    mutation AddChannel(\n        $name: String!\n        $channelTypeId: Int!\n        $workspaceId: Int!\n    ) {\n        channels {\n            addChannel(channelDto: {\n                name: $name\n                channelTypeId: $channelTypeId\n                workspaceId: $workspaceId\n            }) {\n                ...ChannelFields\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation UpdateChannel($channel: ChannelInput!) {\n        channels {\n            updateChannel(channel: $channel) {\n                ...ChannelFields\n            }\n        }\n    }\n"): (typeof documents)["\n    mutation UpdateChannel($channel: ChannelInput!) {\n        channels {\n            updateChannel(channel: $channel) {\n                ...ChannelFields\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation DeleteChannel($id: Int!) {\n        channels {\n            deleteChannel(id: $id)\n        }\n    }\n"): (typeof documents)["\n    mutation DeleteChannel($id: Int!) {\n        channels {\n            deleteChannel(id: $id)\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment DirectMessageUserFields on DirectMessageUser {\n        id\n        nickname\n        avatarUrl\n    }\n"): (typeof documents)["\n    fragment DirectMessageUserFields on DirectMessageUser {\n        id\n        nickname\n        avatarUrl\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment DirectMessageFields on DirectMessage {\n        channel {\n            ...ChannelFields\n        }\n        otherUsers {\n            ...DirectMessageUserFields\n        }\n    }\n"): (typeof documents)["\n    fragment DirectMessageFields on DirectMessage {\n        channel {\n            ...ChannelFields\n        }\n        otherUsers {\n            ...DirectMessageUserFields\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetDirectMessages {\n        channels {\n            directMessageList {\n                ...DirectMessageFields\n            }\n        }\n    }\n"): (typeof documents)["\n    query GetDirectMessages {\n        channels {\n            directMessageList {\n                ...DirectMessageFields\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation OpenDirectMessage($otherUserIds: [UUID!]!) {\n        channels {\n            openDirectMessage(otherUserIds: $otherUserIds) {\n                ...DirectMessageFields\n            }\n        }\n    }\n"): (typeof documents)["\n    mutation OpenDirectMessage($otherUserIds: [UUID!]!) {\n        channels {\n            openDirectMessage(otherUserIds: $otherUserIds) {\n                ...DirectMessageFields\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment UrlPreviewFields on UrlPreview {\n        id\n        createdAt\n        updatedAt\n        url\n        title\n        description\n        thumbnailUrl\n        videoThumbnailUrl\n        siteName\n        favIconUrl\n        type\n        author\n        thumbnailWidth\n        thumbnailHeight\n    }\n"): (typeof documents)["\n    fragment UrlPreviewFields on UrlPreview {\n        id\n        createdAt\n        updatedAt\n        url\n        title\n        description\n        thumbnailUrl\n        videoThumbnailUrl\n        siteName\n        favIconUrl\n        type\n        author\n        thumbnailWidth\n        thumbnailHeight\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment MessageFields on MessageWithUser {\n        id\n        channelId\n        userId\n        user {\n            id\n            nickname\n            fullName\n            displayName\n            avatarUrl\n        }\n        content\n        attachments {\n            ...AttachmentFields\n        }\n        status\n        createdAt\n        updatedAt\n        urlPreviews {\n            ...UrlPreviewFields\n        }\n        reactions {\n            code\n            count\n        }\n        myReactions\n        parentId\n        childrenCount\n        replyTo\n    }\n"): (typeof documents)["\n    fragment MessageFields on MessageWithUser {\n        id\n        channelId\n        userId\n        user {\n            id\n            nickname\n            fullName\n            displayName\n            avatarUrl\n        }\n        content\n        attachments {\n            ...AttachmentFields\n        }\n        status\n        createdAt\n        updatedAt\n        urlPreviews {\n            ...UrlPreviewFields\n        }\n        reactions {\n            code\n            count\n        }\n        myReactions\n        parentId\n        childrenCount\n        replyTo\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment MessagesResultFields on MessagesResult {\n        messages {\n            ...MessageFields\n        }\n        refs {\n            id\n            userId\n            content\n        }\n    }\n"): (typeof documents)["\n    fragment MessagesResultFields on MessagesResult {\n        messages {\n            ...MessageFields\n        }\n        refs {\n            id\n            userId\n            content\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation CreateMessage($messageDto: MessageDtoInput!) {\n        messages {\n            addMessage(messageDto: $messageDto) {\n                ...MessageFields\n            }\n        }\n    }\n"): (typeof documents)["\n    mutation CreateMessage($messageDto: MessageDtoInput!) {\n        messages {\n            addMessage(messageDto: $messageDto) {\n                ...MessageFields\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation UpdateMessage($message: MessageUpdateDtoInput!) {\n        messages {\n            updateMessage(message: $message)\n        }\n    }\n"): (typeof documents)["\n    mutation UpdateMessage($message: MessageUpdateDtoInput!) {\n        messages {\n            updateMessage(message: $message)\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation DeleteMessage($id: Int!) {\n        messages {\n            deleteMessage(id: $id)\n        }\n    }\n"): (typeof documents)["\n    mutation DeleteMessage($id: Int!) {\n        messages {\n            deleteMessage(id: $id)\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation AddReaction($code: String!, $messageId: Int!) {\n        messages {\n            addReaction(code: $code, messageId: $messageId) {\n                status\n                message\n            }\n        }\n    }\n"): (typeof documents)["\n    mutation AddReaction($code: String!, $messageId: Int!) {\n        messages {\n            addReaction(code: $code, messageId: $messageId) {\n                status\n                message\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation DeleteReaction($code: String!, $messageId: Int!) {\n        messages {\n            deleteReaction(code: $code, messageId: $messageId) {\n                status\n                message\n            }\n        }\n    }\n"): (typeof documents)["\n    mutation DeleteReaction($code: String!, $messageId: Int!) {\n        messages {\n            deleteReaction(code: $code, messageId: $messageId) {\n                status\n                message\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetChannelMessages($channelId: Int!) {\n        messages {\n            listChannelMessages(channelId: $channelId) {\n                ...MessagesResultFields\n            }\n        }\n    }\n"): (typeof documents)["\n    query GetChannelMessages($channelId: Int!) {\n        messages {\n            listChannelMessages(channelId: $channelId) {\n                ...MessagesResultFields\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetThreadMessages($threadId: Int!) {\n        messages {\n            listThreadMessages(threadId: $threadId) {\n                ...MessagesResultFields\n            }\n        }\n    }\n"): (typeof documents)["\n    query GetThreadMessages($threadId: Int!) {\n        messages {\n            listThreadMessages(threadId: $threadId) {\n                ...MessagesResultFields\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetPermissionsList {\n        permissions {\n            list {\n                label\n                list\n            }\n        }\n    }\n"): (typeof documents)["\n    query GetPermissionsList {\n        permissions {\n            list {\n                label\n                list\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetMyProfile {\n        users {\n            myProfile {\n                roleNames\n                user {\n                    ...UserFields\n                }\n            }\n        }\n    }\n"): (typeof documents)["\n    query GetMyProfile {\n        users {\n            myProfile {\n                roleNames\n                user {\n                    ...UserFields\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation UpdateMyProfile($profileDto: UpdateMyProfileDtoInput!) {\n        users {\n            updateMyProfile(profileDto: $profileDto) {\n                ...UserFields\n            }\n        }\n    }\n"): (typeof documents)["\n    mutation UpdateMyProfile($profileDto: UpdateMyProfileDtoInput!) {\n        users {\n            updateMyProfile(profileDto: $profileDto) {\n                ...UserFields\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment RoleFields on Role {\n        id\n        name\n        createdAt\n        updatedAt\n    }\n"): (typeof documents)["\n    fragment RoleFields on Role {\n        id\n        name\n        createdAt\n        updatedAt\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation CreateRole($roleDto: RoleCreateDtoInput!) {\n        roles {\n            addRole(roleDto: $roleDto) {\n                ...RoleFields\n            }\n        }\n    }\n"): (typeof documents)["\n    mutation CreateRole($roleDto: RoleCreateDtoInput!) {\n        roles {\n            addRole(roleDto: $roleDto) {\n                ...RoleFields\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation UpdateRole($roleDto: RoleUpdateDtoInput!) {\n        roles {\n            updateRole(roleDto: $roleDto) {\n                ...RoleFields\n            }\n        }\n    }\n"): (typeof documents)["\n    mutation UpdateRole($roleDto: RoleUpdateDtoInput!) {\n        roles {\n            updateRole(roleDto: $roleDto) {\n                ...RoleFields\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation DeleteRole($id: Int!) {\n        roles {\n            deleteRole(id: $id)\n        }\n    }\n"): (typeof documents)["\n    mutation DeleteRole($id: Int!) {\n        roles {\n            deleteRole(id: $id)\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetRoles {\n        roles {\n            list {\n                ...RoleFields\n            }\n        }\n    }\n"): (typeof documents)["\n    query GetRoles {\n        roles {\n            list {\n                ...RoleFields\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment ConfigFields on Config {\n        id\n        name\n        value\n        type\n    }\n"): (typeof documents)["\n    fragment ConfigFields on Config {\n        id\n        name\n        value\n        type\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation UpdateSystemConfigValue($config: ConfigInput!) {\n        configs {\n            updateConfig(config: $config) {\n                ...ConfigFields\n            }\n        }\n    }\n"): (typeof documents)["\n    mutation UpdateSystemConfigValue($config: ConfigInput!) {\n        configs {\n            updateConfig(config: $config) {\n                ...ConfigFields\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetSystemConfig {\n        configs {\n            list {\n                ...ConfigFields\n            }\n        }\n    }\n"): (typeof documents)["\n    query GetSystemConfig {\n        configs {\n            list {\n                ...ConfigFields\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation InstallSystem {\n        installWizard {\n            installSystem {\n                status\n                message\n            }\n        }\n    }\n"): (typeof documents)["\n    mutation InstallSystem {\n        installWizard {\n            installSystem {\n                status\n                message\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment UserFields on User {\n        id\n        nickname\n        fullName\n        active\n        verified\n        banned\n        muted\n        email\n        avatarUrl\n    }\n"): (typeof documents)["\n    fragment UserFields on User {\n        id\n        nickname\n        fullName\n        active\n        verified\n        banned\n        muted\n        email\n        avatarUrl\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetUserById($id: UUID!) {\n        users {\n            userById(id: $id) {\n                ...UserFields\n            }\n        }\n    }\n"): (typeof documents)["\n    query GetUserById($id: UUID!) {\n        users {\n            userById(id: $id) {\n                ...UserFields\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query SearchUsersByNickname($prefix: String!) {\n        users {\n            searchByNickname(prefix: $prefix) {\n                ...DirectMessageUserFields\n            }\n        }\n    }\n"): (typeof documents)["\n    query SearchUsersByNickname($prefix: String!) {\n        users {\n            searchByNickname(prefix: $prefix) {\n                ...DirectMessageUserFields\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment WorkspaceFields on Workspace {\n        id\n        name\n        secObjId\n        createdAt\n        updatedAt\n    }\n"): (typeof documents)["\n    fragment WorkspaceFields on Workspace {\n        id\n        name\n        secObjId\n        createdAt\n        updatedAt\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation AddWorkspace($name: String!) {\n        workspaces {\n            addWorkspace(workspaceDto: { name: $name }) {\n                ...WorkspaceFields\n            }\n        }\n    }\n"): (typeof documents)["\n    mutation AddWorkspace($name: String!) {\n        workspaces {\n            addWorkspace(workspaceDto: { name: $name }) {\n                ...WorkspaceFields\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation UpdateWorkspace($workspace: WorkspaceInput!) {\n        workspaces {\n            updateWorkspace(workspace: $workspace) {\n                ...WorkspaceFields\n            }\n        }\n    }\n"): (typeof documents)["\n    mutation UpdateWorkspace($workspace: WorkspaceInput!) {\n        workspaces {\n            updateWorkspace(workspace: $workspace) {\n                ...WorkspaceFields\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation DeleteWorkspace($id: Int!) {\n        workspaces {\n            deleteWorkspace(id: $id)\n        }\n    }\n"): (typeof documents)["\n    mutation DeleteWorkspace($id: Int!) {\n        workspaces {\n            deleteWorkspace(id: $id)\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetWorkspaces {\n        workspaces {\n            list {\n                ...WorkspaceFields\n            }\n        }\n    }\n"): (typeof documents)["\n    query GetWorkspaces {\n        workspaces {\n            list {\n                ...WorkspaceFields\n            }\n        }\n    }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;