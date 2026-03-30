import { createSignal, createRoot } from '@zen-tui/solid';

/**
 * ZenState: 'Google-Grade' Sovereign Global (V110)
 * 
 * focuses on Absolute Module Convergence.
 */
export const ZenState = (globalThis as any).__ZEN_STATE__ || (() => {
  const [lastKey, setKey] = createSignal('NONE');
  const [tick, setTick] = createSignal(0);

  const instance = {
    lastKey,
    setKey,
    tick,
    bumpTick: () => setTick(t => t + 1)
  };

  (globalThis as any).__ZEN_STATE__ = instance;
  return instance;
})();
