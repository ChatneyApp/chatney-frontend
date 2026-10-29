import { isMessageEdited } from './messages';

describe('isMessageEdited', () => {
    it.each([
        ['2026-01-15T10:00:05.123Z', '2026-01-15T10:00:05.123Z', false],
        ['2026-01-15T10:00:05.123Z', '2026-01-15T10:00:05.127Z', false],
        ['2026-01-15T10:00:05.998Z', '2026-01-15T10:00:06.001Z', false],
        ['2026-01-15T10:00:05.000Z', '2026-01-15T10:00:06.000Z', true],
        ['2026-01-15T10:00:00Z', '2026-01-15T10:05:00Z', true],
    ] satisfies Array<[string, string, boolean]>)('createdAt %s, updatedAt %s → %s', (createdAt, updatedAt, expected) => {
        expect(isMessageEdited({ createdAt, updatedAt })).toBe(expected);
    });
});
