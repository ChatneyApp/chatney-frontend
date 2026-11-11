import clsx from 'clsx';

import { getAvatarSrc } from '@/helpers/avatar';
import { getUserDisplayName, getUserInitials } from '@/helpers/nickname';
import { getUserHue } from '@/helpers/userColor';

import styles from './UserAvatar.module.css';

type Props = {
    user: {
        id: string;
        nickname: string;
        fullName?: string | null;
        avatarUrl?: string | null;
    };
    /** Sets the size, e.g. a class with `w-10 h-10`. */
    className?: string;
};

/** A user's round avatar: their image, or their initials on a colour derived from the user id when they have none. */
export function UserAvatar({ user, className }: Props) {
    const src = getAvatarSrc(user.avatarUrl);
    const name = getUserDisplayName(user);

    if (src) {
        return <img src={src} alt={name} className={clsx(styles.avatar, className)} />;
    }

    return (
        <div
            role="img"
            aria-label={name}
            className={clsx(styles.initials, className)}
            style={{ backgroundColor: `hsl(${getUserHue(user.id)} 45% 40%)` }}
        >
            {getUserInitials(user)}
        </div>
    );
}
