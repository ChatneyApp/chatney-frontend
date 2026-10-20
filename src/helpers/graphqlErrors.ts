import { CombinedGraphQLErrors } from '@apollo/client';

export const FORBIDDEN_ACTION = 'FORBIDDEN_ACTION';
export const NOT_FOUND = 'NOT_FOUND';

export function getGraphQLErrorCode(error: unknown): string | undefined {
    if (!CombinedGraphQLErrors.is(error)) {
        return undefined;
    }

    const code = error.errors[0]?.extensions?.code;
    return typeof code === 'string' ? code : undefined;
}
