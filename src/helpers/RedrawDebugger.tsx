import { PropsWithChildren } from 'react';

type Props = {
    name: string;
} & PropsWithChildren;
export const RedrawDebugger = ({ name, children }: Props) => {
    console.log(`[DEBUG] RedrawDebugger: ${name} rendered`);
    return children;
};
