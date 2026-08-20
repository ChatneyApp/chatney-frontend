import { gql, type TypedDocumentNode } from '@apollo/client';

import { User } from '@/types/users';

export type UserProfile = {
    user: User;
    globalRoleName: string | null;
};

export type GetMyProfileResponse = {
    users: {
        myProfile: UserProfile;
    };
};

export type UpdateMyProfileResponse = {
    users: {
        updateMyProfile: User;
    };
};

export const GET_MY_PROFILE: TypedDocumentNode<GetMyProfileResponse> = gql`
    query GetMyProfile {
        users {
            myProfile {
                globalRoleName
                user {
                    id
                    nickname
                    fullName
                    email
                    avatarUrl
                    active
                    verified
                    banned
                    muted
                }
            }
        }
    }
`;

export const UPDATE_MY_PROFILE = gql`
    mutation UpdateMyProfile($profileDto: UpdateMyProfileDtoInput!) {
        users {
            updateMyProfile(profileDto: $profileDto) {
                id
                nickname
                fullName
                email
                avatarUrl
                active
                verified
                banned
                muted
            }
        }
    }
`;
