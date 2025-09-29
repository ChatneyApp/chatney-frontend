import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

import styles from './Button.module.css';

export const Button = ({ children, className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button className={clsx(styles.button, className)} {...rest}>
        {children}
    </button>
);
