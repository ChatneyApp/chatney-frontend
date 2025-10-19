import { useState } from 'react';
import { Popover } from 'radix-ui';

import { Cross2Icon } from '@radix-ui/react-icons';
import styles from './ReactionSelectionDialog.module.css';

type Props = {
    reactions: string[];
    onSelect(code: string): void;
}
export const ReactionSelectionDialog = ({ reactions, onSelect }: Props) => {
    const [ isOpen, setIsOpen ] = useState(false);
    const handleClose = (code: string) => {
        onSelect(code);
        setIsOpen(false);
    };

    return (
        <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
            <Popover.Trigger asChild>
                <button
                    className={styles.triggerButton}
                    aria-label="Update dimensions"
                >
                    🙂
                </button>
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content
                    className={styles.popoverContent}
                    sideOffset={5}
                >
                    <div className={styles.reactionsList}>
                        {reactions.map(reaction => (
                            <div
                                key={reaction}
                                aria-label="Close"
                                className={styles.reaction}
                                onClick={() => handleClose(reaction)}
                            >
                                {reaction}
                            </div>
                        ))}
                    </div>
                    <Popover.Close
                        className="absolute right-[5px] top-[5px] inline-flex size-[25px] cursor-default items-center justify-center rounded-full text-violet11 outline-none hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7"
                        aria-label="Close"
                    >
                        <Cross2Icon/>
                    </Popover.Close>
                    <Popover.Arrow className={styles.popupArrow}/>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
