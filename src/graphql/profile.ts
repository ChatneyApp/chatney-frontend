import { graphql } from '@/graphql/generated';

export const GET_MY_PROFILE = graphql(`
    query GetMyProfile {
        users {
            myProfile {
                roleNames
                user {
                    ...UserFields
                }
            }
        }
    }
`);

export const UPDATE_MY_PROFILE = graphql(`
    mutation UpdateMyProfile($profileDto: UpdateMyProfileDtoInput!) {
        users {
            updateMyProfile(profileDto: $profileDto) {
                ...UserFields
            }
        }
    }
`);
