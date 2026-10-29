// Config values are stored as strings; `type` says how to parse them ("string[]" is comma-separated).

export type ConfigFormValue = string | boolean;

const splitList = (value: string, separator: string | RegExp) =>
    value.split(separator).map(item => item.trim()).filter(item => item !== '');

/** Converts a stored config value to the value its editor works with. */
export const toFormValue = (type: string, value: string): ConfigFormValue => {
    switch (type) {
        case 'bool':
            return value === 'true';
        case 'string[]':
            return splitList(value, ',').join('\n');
        default:
            return value;
    }
};

/** Converts an editor value back to the stored string. A "string[]" editor holds one item per line. */
export const fromFormValue = (type: string, value: ConfigFormValue): string => {
    switch (type) {
        case 'bool':
            return value === true ? 'true' : 'false';
        case 'int':
            return String(value).trim();
        case 'string[]':
            return splitList(String(value), /\r?\n/).join(',');
        default:
            return String(value);
    }
};

export const isIntegerString = (value: string) => /^-?\d+$/.test(value.trim());

/** An http(s) origin such as `http://localhost:5173` or `https://my.domain.com`, with no path. */
export const isValidDomainUrl = (value: string) => {
    let url: URL;
    try {
        url = new URL(value.trim());
    } catch {
        return false;
    }

    return (url.protocol === 'http:' || url.protocol === 'https:')
        && url.pathname === '/'
        && url.search === ''
        && url.hash === '';
};
