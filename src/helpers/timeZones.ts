export const timeZones = [
    'UTC',
    'America/Los_Angeles',
    'America/Denver',
    'America/Chicago',
    'America/New_York',
    'America/Sao_Paulo',
    'Europe/London',
    'Europe/Berlin',
    'Europe/Kyiv',
    'Asia/Dubai',
    'Asia/Kolkata',
    'Asia/Singapore',
    'Asia/Tokyo',
    'Australia/Sydney',
];

/** The time zone list, with `selected` first when the list doesn't contain it, so a select can show it. */
export const getTimeZoneOptions = (selected: string): string[] =>
    !selected || timeZones.includes(selected) ? timeZones : [selected, ...timeZones];
