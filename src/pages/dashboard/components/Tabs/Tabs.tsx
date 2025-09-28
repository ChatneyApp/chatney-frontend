import { ComponentProps } from 'react';
import { Tabs } from 'radix-ui';

import styles from './Tabs.module.css';

type RootProps = ComponentProps<typeof Tabs.Root>;
export const TabsRoot = ({ children, ...rest }: RootProps) => (
    <Tabs.Root
        {...rest}
        className={styles.tabsRoot}
    >
        {children}
    </Tabs.Root>
);

type TriggerProps = ComponentProps<typeof Tabs.Trigger>;
export const TabsTrigger = ({ children, ...rest }: TriggerProps) => (
    <Tabs.Trigger
        {...rest}
        className={styles.tabsTrigger}
    >
        {children}
    </Tabs.Trigger>
);

type ListProps = ComponentProps<typeof Tabs.List>;
export const TabsList = ({ children, ...rest }: ListProps) => (
    <Tabs.List
        {...rest}
        className={styles.tabsList}
    >
        {children}
    </Tabs.List>
);

type ContentProps = ComponentProps<typeof Tabs.Content>;
export const TabsContent = ({ children, ...rest }: ContentProps) => (
    <Tabs.Content
        {...rest}
        className={styles.tabsContent}
    >
        {children}
    </Tabs.Content>
);
