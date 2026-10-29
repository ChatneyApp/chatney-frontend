import { getTimeZoneOptions, timeZones } from './timeZones';

describe('getTimeZoneOptions', () => {
    it('returns the list as is when it contains the selected time zone', () => {
        expect(getTimeZoneOptions('Europe/Kyiv')).toEqual(timeZones);
    });

    it('prepends a selected time zone the list does not contain', () => {
        expect(getTimeZoneOptions('Europe/Paris')).toEqual(['Europe/Paris', ...timeZones]);
    });

    it('ignores an empty selection', () => {
        expect(getTimeZoneOptions('')).toEqual(timeZones);
    });
});
