import { useState } from 'react';
import { Clock3, Search, Settings, Smile } from 'lucide-react';
import { Popover } from 'radix-ui';

import { REACTION_DETAILS, ReactionOption } from '@/pages/client/Chat/emojis';

import styles from './ReactionSelectionDialog.module.css';

type Props = {
    reactions: string[];
    myReactions: string[];
    onSelect(code: string): void;
}


const toReactionOption = (code: string): ReactionOption => {
    const reactionDetails = REACTION_DETAILS[code];
    if (reactionDetails) {
        return { code, ...reactionDetails };
    }

    return {
        code,
        emoji: code,
        label: code,
        category: 'popular',
    };
};

export const ReactionSelectionDialog = ({ reactions, myReactions, onSelect }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    const handleClose = (code: string) => {
        onSelect(code);
        setIsOpen(false);
        setSearchValue('');
    };

    const reactionOptions = reactions
        .filter(reaction => !myReactions.includes(reaction))
        .map(toReactionOption);

    const search = searchValue.trim().toLowerCase();
    const filteredReactions = reactionOptions.filter(reaction => (
        search.length === 0
        || reaction.code.toLowerCase().includes(search)
        || reaction.label.toLowerCase().includes(search)
    ));

    const popularReactions = filteredReactions.filter(reaction => reaction.category === 'popular');
    const activityReactions = filteredReactions.filter(reaction => reaction.category === 'activity');

    if (reactionOptions.length === 0) {
        return null;
    }

    return (
        <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
            <Popover.Trigger asChild>
                <button
                    type="button"
                    className={styles.triggerButton}
                    aria-label="Add reaction"
                >
                    🙂
                </button>
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content
                    className={styles.popoverContent}
                    sideOffset={10}
                    align="start"
                >
                    <div className={styles.searchField}>
                        <Search className={styles.searchIcon} aria-hidden="true"/>
                        <input
                            className={styles.searchInput}
                            value={searchValue}
                            onChange={(event) => setSearchValue(event.target.value)}
                            placeholder="Search emojis..."
                            aria-label="Search emojis"
                        />
                    </div>

                    <div className={styles.reactionSections}>
                        {popularReactions.length > 0 && (
                            <section className={styles.reactionSection}>
                                <h3 className={styles.sectionTitle}>Popular reactions</h3>
                                <div className={styles.reactionsList}>
                                    {popularReactions.map(reaction => (
                                        <button
                                            key={reaction.code}
                                            type="button"
                                            aria-label={reaction.label}
                                            className={styles.reaction}
                                            onClick={() => handleClose(reaction.code)}
                                        >
                                            {reaction.emoji}
                                        </button>
                                    ))}
                                </div>
                            </section>
                        )}

                        {activityReactions.length > 0 && (
                            <section className={styles.reactionSection}>
                                <h3 className={styles.sectionTitle}>Activity</h3>
                                <div className={styles.reactionsList}>
                                    {activityReactions.map(reaction => (
                                        <button
                                            key={reaction.code}
                                            type="button"
                                            aria-label={reaction.label}
                                            className={styles.reaction}
                                            onClick={() => handleClose(reaction.code)}
                                        >
                                            {reaction.emoji}
                                        </button>
                                    ))}
                                </div>
                            </section>
                        )}

                        {filteredReactions.length === 0 && (
                            <div className={styles.emptyState}>No matching emojis</div>
                        )}
                    </div>

                    <div className={styles.footer}>
                        <div className={styles.footerActions}>
                            <button type="button" className={styles.footerButton} aria-label="Emoji reactions">
                                <Smile size={19}/>
                            </button>
                            <button type="button" className={styles.footerButton} aria-label="Recent reactions">
                                <Clock3 size={19}/>
                            </button>
                            <button type="button" className={styles.footerButton} aria-label="Reaction settings">
                                <Settings size={19}/>
                            </button>
                        </div>
                        <button type="button" className={styles.viewAllButton}>
                            View all
                        </button>
                    </div>
                    <Popover.Arrow className={styles.popupArrow}/>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
