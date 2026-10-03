import type { UserFieldsFragment } from '@/graphql/generated/graphql';

export type UserId = string;
export type UserAuthorization = {
    id: UserId;
    token: string;
}
export type User = UserFieldsFragment;
