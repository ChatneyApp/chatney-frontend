import { readFileSync } from 'fs';
import { join } from 'path';
import { load } from 'js-yaml';

const PLURAL_SUFFIX = /_(zero|one|two|few|many|other)$/;

const readLocale = (locale: string) =>
    load(readFileSync(join(__dirname, `${locale}.yml`), 'utf8')) as Record<string, unknown>;

// Flattens nested keys and collapses plural variants (`key_one`, `key_few`, ...) into `key`,
// because languages use different plural forms.
const collectKeys = (node: Record<string, unknown>, prefix = ''): Set<string> => {
    const keys = new Set<string>();

    for (const [key, value] of Object.entries(node)) {
        const path = `${prefix}${key}`;
        if (value !== null && typeof value === 'object') {
            collectKeys(value as Record<string, unknown>, `${path}.`).forEach(nested => keys.add(nested));
        } else {
            keys.add(path.replace(PLURAL_SUFFIX, ''));
        }
    }

    return keys;
};

describe('locales', () => {
    const englishKeys = collectKeys(readLocale('en'));

    it.each(['ru', 'uk'])('%s has the same keys as en', (locale) => {
        const localeKeys = collectKeys(readLocale(locale));

        expect([...englishKeys].filter(key => !localeKeys.has(key))).toEqual([]);
        expect([...localeKeys].filter(key => !englishKeys.has(key))).toEqual([]);
    });
});
