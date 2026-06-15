export type ReactionOption = {
    code: string;
    emoji: string;
    label: string;
    category: 'popular' | 'activity';
}

export enum ReactionCategory {
    POPULAR = 'popular',
    ACTIVITY = 'activity'
}

export const REACTION_DETAILS: Record<string, Omit<ReactionOption, 'code'>> = {
    fire: { emoji: '🔥', label: 'Fire', category: ReactionCategory.POPULAR },
    smile: { emoji: '🙂', label: 'Smile', category: ReactionCategory.POPULAR },
    hundred: { emoji: '💯', label: 'Hundred', category: ReactionCategory.POPULAR },
    rocket: { emoji: '🚀', label: 'Rocket', category: ReactionCategory.POPULAR },
    sparkles: { emoji: '✨', label: 'Sparkles', category: ReactionCategory.POPULAR },
    pray: { emoji: '🙏', label: 'Pray', category: ReactionCategory.POPULAR },
    heart: { emoji: '❤️', label: 'Heart', category: ReactionCategory.POPULAR },
    man_shrugging: { emoji: '🤷‍♂️', label: 'Man shrugging', category: ReactionCategory.POPULAR },
    woman_shrugging: { emoji: '🤷‍♀️', label: 'Woman shrugging', category: ReactionCategory.POPULAR },
    person_shrugging: { emoji: '🤷', label: 'Person shrugging', category: ReactionCategory.POPULAR },
    handshake: { emoji: '🤝', label: 'Handshake', category: ReactionCategory.POPULAR },
    smirking: { emoji: '😏', label: 'Smirking', category: ReactionCategory.POPULAR },
    grimacing: { emoji: '😬', label: 'Grimacing', category: ReactionCategory.POPULAR },
    eyes: { emoji: '👀', label: 'Eyes', category: ReactionCategory.POPULAR },
    tongue: { emoji: '😛', label: 'Tongue', category: ReactionCategory.POPULAR },
    glasses: { emoji: '😎', label: 'Glasses', category: ReactionCategory.POPULAR },
    hour_glass: { emoji: '⌛', label: 'Hour glass', category: ReactionCategory.POPULAR },
    thumbs_up: { emoji: '👍', label: 'Thumbs up', category: ReactionCategory.POPULAR },
    thumbs_down: { emoji: '👎', label: 'Thumbs down', category: ReactionCategory.POPULAR },
    finger_up: { emoji: '☝️', label: 'Finger up', category: ReactionCategory.POPULAR },
    finger_down: { emoji: '👇', label: 'Finger down', category: ReactionCategory.POPULAR },
    middle_finger: { emoji: '🖕', label: 'Middle finger', category: ReactionCategory.POPULAR },
    clown: { emoji: '🤡', label: 'Clown', category: ReactionCategory.POPULAR },
    rofl: { emoji: '🤣', label: 'ROFL', category: ReactionCategory.POPULAR },
    flag_ua: { emoji: '🇺🇦', label: 'Ukraine flag', category: ReactionCategory.POPULAR },
    flag_ca: { emoji: '🇨🇦', label: 'Canada flag', category: ReactionCategory.POPULAR },
    flag_us: { emoji: '🇺🇸', label: 'United States flag', category: ReactionCategory.POPULAR },
    flag_gb: { emoji: '🇬🇧', label: 'United Kingdom flag', category: ReactionCategory.POPULAR },
    flag_es: { emoji: '🇪🇸', label: 'Spain flag', category: ReactionCategory.POPULAR },
    flag_it: { emoji: '🇮🇹', label: 'Italy flag', category: ReactionCategory.POPULAR },
    runner: { emoji: '🏃', label: 'Runner', category: ReactionCategory.ACTIVITY },
    snowboarder: { emoji: '🏂', label: 'Snowboarder', category: ReactionCategory.ACTIVITY },
    cyclist: { emoji: '🚴', label: 'Cyclist', category: ReactionCategory.ACTIVITY },
    weightlifter: { emoji: '🏋️', label: 'Weightlifter', category: ReactionCategory.ACTIVITY },
    cartwheel: { emoji: '🤸', label: 'Cartwheel', category: ReactionCategory.ACTIVITY },
    lotus: { emoji: '🧘', label: 'Meditation', category: ReactionCategory.ACTIVITY },
};

export const ALL_REACTION_CODES = Object.keys(REACTION_DETAILS);
