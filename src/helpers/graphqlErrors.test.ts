import { CombinedGraphQLErrors } from '@apollo/client';

import { FORBIDDEN_ACTION, getGraphQLErrorCode } from './graphqlErrors';

describe('getGraphQLErrorCode', () => {
    it('returns the code of the first GraphQL error', () => {
        const error = new CombinedGraphQLErrors({
            errors: [{ message: FORBIDDEN_ACTION, extensions: { code: FORBIDDEN_ACTION } }],
        });

        expect(getGraphQLErrorCode(error)).toBe(FORBIDDEN_ACTION);
    });

    it('returns undefined when the GraphQL error has no code', () => {
        const error = new CombinedGraphQLErrors({ errors: [{ message: 'Something failed' }] });

        expect(getGraphQLErrorCode(error)).toBeUndefined();
    });

    it('returns undefined for non-GraphQL errors', () => {
        expect(getGraphQLErrorCode(new Error('Network down'))).toBeUndefined();
    });
});
