import { createSignal } from '@zen-tui/solid';

/**
 * Sovereign Global Store: Local Reactive Context
 */

// 1. Initial State: Persistence-Safe Signal Initialization
const [getFooterMode, setFooterUpdate] = createSignal('passive');
const [getLastKey, setKeyUpdate] = createSignal('NONE');

// 2. High-Fidelity Accessors
export const footerMode = getFooterMode;
export const lastKey = getLastKey;

// 3. Sovereign Actions
export const setFooterMode = (mode: string) => {
  // console.log(`[ACTION_STORE] Setting mode: ${mode}`);
  setFooterUpdate(mode);
};

export const setLastKey = (key: string) => {
  setKeyUpdate(key);
};
