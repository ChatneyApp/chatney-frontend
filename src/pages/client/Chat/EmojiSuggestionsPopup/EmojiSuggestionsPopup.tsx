import { KeyboardEvent, Ref, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import clsx from 'clsx';
import { Popover } from 'radix-ui';

import { ALL_REACTION_CODES, REACTION_DETAILS } from '@/pages/client/Chat/emojis';

import styles from './EmojiSuggestionsPopup.module.css';

export type EmojiSuggestion = {
    code: string;
    emoji: string;
    label: string;
};

export type EmojiSuggestionsPopupHandle = {
    // returns true when the popup consumed the key (caller should preventDefault)
    handleKeyDown(e: KeyboardEvent<HTMLElement>): boolean;
};

type Props = {
    query: string | null;
    onSelect(suggestion: EmojiSuggestion): void;
    ref?: Ref<EmojiSuggestionsPopupHandle>;
};

const MAX_EMOJI_SUGGESTIONS = 8;

const searchEmojis = (query: string): EmojiSuggestion[] => {
    const needle = query.toLowerCase();
    const prefixMatches: EmojiSuggestion[] = [];
    const substringMatches: EmojiSuggestion[] = [];

    for (const code of ALL_REACTION_CODES) {
        const { emoji, label } = REACTION_DETAILS[code];
        const codeLower = code.toLowerCase();
        const labelLower = label.toLowerCase();

        if (codeLower.startsWith(needle) || labelLower.startsWith(needle)) {
            prefixMatches.push({ code, emoji, label });
        } else if (codeLower.includes(needle) || labelLower.includes(needle)) {
            substringMatches.push({ code, emoji, label });
        }
    }

    const byLabel = (a: EmojiSuggestion, b: EmojiSuggestion) => a.label.localeCompare(b.label);

    return [...prefixMatches.sort(byLabel), ...substringMatches.sort(byLabel)].slice(0, MAX_EMOJI_SUGGESTIONS);
};

// anchored where it's rendered; flips below its anchor via Radix collision detection if there's no room above
export function EmojiSuggestionsPopup({ query, onSelect, ref }: Props) {
    const suggestions = useMemo(() => (query ? searchEmojis(query) : []), [query]);
    const [highlighted, setHighlighted] = useState(0);
    const activeIndex = Math.min(highlighted, suggestions.length - 1);

    useEffect(() => {
        setHighlighted(0);
    }, [query]);

    useImperativeHandle(ref, () => ({
        handleKeyDown(e) {
            if (suggestions.length === 0) {
                return false;
            }

            if (e.key === 'ArrowDown') {
                setHighlighted(index => (index + 1) % suggestions.length);
                return true;
            }
            if (e.key === 'ArrowUp') {
                setHighlighted(index => (index - 1 + suggestions.length) % suggestions.length);
                return true;
            }
            if (e.key === 'Enter') {
                onSelect(suggestions[activeIndex]);
                return true;
            }
            return false;
        },
    }));

    const isOpen = suggestions.length > 0;

    return (
        <Popover.Root open={isOpen}>
            {/* Zero-size marker kept at the popup's original DOM position; Radix positions the portalled content relative to it and flips side/align to avoid viewport collisions. */}
            <Popover.Anchor asChild>
                <span className={styles.anchor} />
            </Popover.Anchor>
            <Popover.Portal>
                <Popover.Content
                    role="listbox"
                    aria-label="Emoji suggestions"
                    className={styles.container}
                    side="top"
                    align="start"
                    sideOffset={8}
                    collisionPadding={8}
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    onCloseAutoFocus={(e) => e.preventDefault()}
                >
                    {suggestions.map((suggestion, index) => (
                        <button
                            type="button"
                            key={suggestion.code}
                            role="option"
                            aria-selected={index === activeIndex}
                            className={clsx(styles.suggestion, index === activeIndex && styles.suggestionActive)}
                            onMouseDown={(e) => {
                                // keep focus in the text input while picking with the mouse
                                e.preventDefault();
                                onSelect(suggestion);
                            }}
                            onMouseEnter={() => setHighlighted(index)}
                        >
                            <span className={styles.emoji}>{suggestion.emoji}</span>
                            <span className={styles.label}>{suggestion.label}</span>
                            <span className={styles.code}>:{suggestion.code}:</span>
                        </button>
                    ))}
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
