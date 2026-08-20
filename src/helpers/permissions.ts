export function camelCaseToLabel(text: string): string {
    const words = text
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
        .split(' ');

    const [first, ...rest] = words;

    if (!first) {
        return '';
    }

    return [
        first.charAt(0).toUpperCase() + first.slice(1).toLowerCase(),
        ...rest.map((word) => word.toLowerCase()),
    ].join(' ');
}

export function formatPermissionLabel(permission: string): string {
    const action = permission.includes('.')
        ? permission.split('.').pop()!
        : permission;

    return camelCaseToLabel(action);
}
