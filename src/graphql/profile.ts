import { graphql } from '@/graphql/generated';

export const GET_MY_PROFILE = graphql(`
    query GetMyProfile {
        users {
            myProfile {
                roleNames
                user {
                    ...UserFields
                    bio
                }
            }
        }
    }
`);

export const UPLOAD_AVATAR = graphql(`
    mutation UploadAvatar($file: Upload!) {
        users {
            uploadAvatar(file: $file) {
                ...UserFields
            }
        }
    }
`);

export const CLEAR_AVATAR = graphql(`
    mutation ClearAvatar {
        users {
            clearAvatar {
                ...UserFields
            }
        }
    }
`);

export const UPDATE_MY_PROFILE = graphql(`
    mutation UpdateMyProfile($profileDto: UpdateMyProfileDtoInput!) {
        users {
            updateMyProfile(profileDto: $profileDto) {
                ...UserFields
                bio
            }
        }
    }
`);
