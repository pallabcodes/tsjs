import { createSignal } from 'solid-js';
import { requestFrame } from '@zen-tui/solid';

export type ZenStateProps = {
   mode: () => 'passive' | 'active';
   lastKey: () => string;
   tick: () => number;
};

export type ZenAction = 
  | { type: 'KEY_PRESS', key: string }
  | { type: 'SET_MODE', mode: 'passive' | 'active' };

export type ZenContextValue = [ZenStateProps, (action: ZenAction) => void];

/**
 * Pure Factory for generating deterministic isolated state machines.
 */
export function createZenStore(): ZenContextValue {
  const [mode, setMode] = createSignal<'passive' | 'active'>('passive');
  const [lastKey, setKey] = createSignal<string>('NONE');
  const [tick, setTick] = createSignal<number>(0);

  const state: ZenStateProps = { mode, lastKey, tick };

  const dispatch = (action: ZenAction) => {
    switch (action.type) {
      case 'KEY_PRESS':
        setTick(t => t + 1);
        setKey(action.key);
        if (action.key === ':') setMode('active');
        if (action.key === 'esc' || action.key === 'escape') setMode('passive');
        break;
      case 'SET_MODE':
        setMode(action.mode);
        break;
    }
    // Eagerly trigger rendering update safely if environment allows
    try { requestFrame(); } catch(e) { /* ignore in headless tests */ }
  };
  
  return [state, dispatch];
}

/**
 * Application-wide Singleton
 * This perfectly replaces the Context-Provider and `globalThis` hacks 
 * by operating strictly over NodeJS Module Caching without context collision in custom JSX runtime.
 */
export const ZenStore = createZenStore();
export const [useZenState, useZenDispatch] = ZenStore;
