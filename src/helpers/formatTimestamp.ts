import { DateTime } from 'luxon';

export function formatTimestamp(timestamp: Date): string {
    const dateTime = DateTime.fromJSDate(timestamp);
    const isWithinLastDay = dateTime > DateTime.now().minus({ hours: 24 });
    return dateTime.toFormat(isWithinLastDay ? 'HH:mm' : 'dd.MM.yyyy HH:mm');
}
