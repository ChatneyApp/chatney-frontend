import { fromFormValue, isIntegerString, isValidDomainUrl, toFormValue } from './configValues';

describe('toFormValue', () => {
    it.each([
        ['bool', 'true', true],
        ['bool', 'false', false],
        ['int', '587', '587'],
        ['string', 'smtp.example.com', 'smtp.example.com'],
        ['string[]', 'a, b,,c', 'a\nb\nc'],
        ['string[]', '', ''],
    ] satisfies Array<[string, string, string | boolean]>)('converts %s %p', (type, value, expected) => {
        expect(toFormValue(type, value)).toEqual(expected);
    });
});

describe('fromFormValue', () => {
    it.each([
        ['bool', true, 'true'],
        ['bool', false, 'false'],
        ['int', ' 25 ', '25'],
        ['string', ' keep spaces ', ' keep spaces '],
        ['string[]', 'a\r\n b \n\nc\n', 'a,b,c'],
    ] satisfies Array<[string, string | boolean, string]>)('converts %s %p', (type, value, expected) => {
        expect(fromFormValue(type, value)).toEqual(expected);
    });
});

describe('isIntegerString', () => {
    it.each([
        ['25', true],
        [' -3 ', true],
        ['2.5', false],
        ['', false],
        ['abc', false],
    ])('%p is %p', (value, expected) => {
        expect(isIntegerString(value)).toBe(expected);
    });
});

describe('isValidDomainUrl', () => {
    it.each([
        ['http://localhost:5173', true],
        ['https://my.domain.com', true],
        ['https://my.domain.com/', true],
        ['my.domain.com', false],
        ['ftp://my.domain.com', false],
        ['https://my.domain.com/client', false],
        ['https://my.domain.com?a=1', false],
        ['', false],
    ])('%p is %p', (value, expected) => {
        expect(isValidDomainUrl(value)).toBe(expected);
    });
});
