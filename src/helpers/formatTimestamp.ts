import { DateTime } from 'luxon';

export function formatTimestamp(timestamp: Date): string {
    return DateTime.fromJSDate(timestamp).toFormat('dd.MM.yyyy HH:mm');
}
