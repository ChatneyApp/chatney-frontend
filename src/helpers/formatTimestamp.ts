import dayjs from 'dayjs';

export function formatTimestamp(timestamp: Date): string {
    return dayjs(timestamp).format('DD.MM.YYYY HH:mm');
}
