/** A stable hue (0-359) derived from the user id. */
export const getUserHue = (userId: string): number => {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
        hash = (hash * 31 + userId.charCodeAt(i)) >>> 0;
    }

    return hash % 360;
};

/** A stable colour for a user's name, readable on the dark message background. */
export const getUserColor = (userId: string): string => `hsl(${getUserHue(userId)} 70% 72%)`;
