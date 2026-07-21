import { useState } from 'react';
import { Search } from 'lucide-react';
import { Popover, Tabs } from 'radix-ui';

import { REACTION_CATEGORIES, REACTION_DETAILS, ReactionCategory, ReactionOption } from '@/pages/client/Chat/emojis';

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
        category: ReactionCategory.SMILEYS,
    };
};

export const ReactionSelectionDialog = ({ reactions, myReactions, onSelect }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [activeCategory, setActiveCategory] = useState<string>(REACTION_CATEGORIES[0].id);

    const handleClose = (code: string) => {
        onSelect(code);
        setIsOpen(false);
        setSearchValue('');
    };

    const reactionOptions = reactions
        .filter(reaction => !myReactions.includes(reaction))
        .map(toReactionOption);

    const search = searchValue.trim().toLowerCase();
    const isSearching = search.length > 0;
    const filteredReactions = reactionOptions.filter(reaction => (
        reaction.code.toLowerCase().includes(search)
        || reaction.label.toLowerCase().includes(search)
    ));

    if (reactionOptions.length === 0) {
        return null;
    }

    const renderReactionsGrid = (options: ReactionOption[]) => {
        if (options.length === 0) {
            return <div className={styles.emptyState}>No matching emojis</div>;
        }

        return (
            <div className={styles.reactionsList}>
                {options.map(reaction => (
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
        );
    };

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

                    {isSearching ? (
                        <div className={styles.searchResults}>
                            {renderReactionsGrid(filteredReactions)}
                        </div>
                    ) : (
                        <Tabs.Root
                            value={activeCategory}
                            onValueChange={setActiveCategory}
                            className={styles.tabsRoot}
                        >
                            <Tabs.List className={styles.tabsList} aria-label="Emoji categories">
                                {REACTION_CATEGORIES.map(({ id, title, Icon }) => (
                                    <Tabs.Trigger
                                        key={id}
                                        value={id}
                                        className={styles.tabTrigger}
                                        title={title}
                                        aria-label={title}
                                    >
                                        <Icon size={18} aria-hidden="true"/>
                                    </Tabs.Trigger>
                                ))}
                            </Tabs.List>
                            {REACTION_CATEGORIES.map(({ id }) => (
                                <Tabs.Content key={id} value={id} className={styles.tabContent}>
                                    {renderReactionsGrid(reactionOptions.filter(reaction => reaction.category === id))}
                                </Tabs.Content>
                            ))}
                        </Tabs.Root>
                    )}
                    <Popover.Arrow className={styles.popupArrow}/>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
