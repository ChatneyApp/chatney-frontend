import { getUserColor, getUserHue } from './userColor';

describe('getUserHue', () => {
    it('returns the same hue for the same id', () => {
        expect(getUserHue('6650f1c2a4b3d2e1f0a9b8c7')).toBe(getUserHue('6650f1c2a4b3d2e1f0a9b8c7'));
    });

    it('returns different hues for ids that differ in the last character', () => {
        expect(getUserHue('6650f1c2a4b3d2e1f0a9b8c7')).not.toBe(getUserHue('6650f1c2a4b3d2e1f0a9b8c8'));
    });

    it('stays within the hue range', () => {
        ['', 'a', 'user-1', '6650f1c2a4b3d2e1f0a9b8c7', 'f'.repeat(200)].forEach(id => {
            const hue = getUserHue(id);
            expect(hue).toBeGreaterThanOrEqual(0);
            expect(hue).toBeLessThan(360);
        });
    });
});

describe('getUserColor', () => {
    it('builds an hsl colour from the hue', () => {
        expect(getUserColor('user-1')).toBe(`hsl(${getUserHue('user-1')} 70% 72%)`);
    });
});
