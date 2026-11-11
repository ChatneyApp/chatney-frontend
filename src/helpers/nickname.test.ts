import { getUserInitials } from './nickname';

describe('getUserInitials', () => {
    it('takes the first letters of the first two words of the full name', () => {
        expect(getUserInitials({ fullName: 'emma clarke', nickname: 'emma_c' })).toBe('EC');
        expect(getUserInitials({ fullName: '  Anna  Maria de Souza ', nickname: 'anna' })).toBe('AM');
    });

    it('returns one letter for a one-word name', () => {
        expect(getUserInitials({ fullName: 'Priya', nickname: 'priya_nair' })).toBe('P');
    });

    it('falls back to the nickname when there is no full name', () => {
        expect(getUserInitials({ fullName: null, nickname: 'test1' })).toBe('T');
        expect(getUserInitials({ fullName: '   ', nickname: 'admin' })).toBe('A');
    });
});
