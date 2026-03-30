import { createSignal } from '@zen-tui/solid';

/**
 * Sovereign Master State
 */
export const [footerMode, setFooterModeSignal] = createSignal('passive');
export const [lastKey, setLastKey] = createSignal('NONE');
