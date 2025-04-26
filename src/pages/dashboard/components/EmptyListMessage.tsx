import {PropsWithChildren} from 'react';

export const EmptyListMessage = ({children}: PropsWithChildren) => (
    <div className="p-4">
        {children}
    </div>
);
