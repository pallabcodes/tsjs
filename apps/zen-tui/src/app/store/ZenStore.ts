import { createSignal } from 'solid-js';
import { requestFrame } from '@zen-tui/solid';

export type ZenStateProps = {
   mode: () => 'passive' | 'active';
   lastKey: () => string;
   tick: () => number;
   explorerIndex: () => number;
   explorerFiles: () => any[];
};

export type ZenAction = 
  | { type: 'KEY_PRESS', key: string }
  | { type: 'SET_MODE', mode: 'passive' | 'active' }
  | { type: 'EXPLORER_MOVE', offset: number }
  | { type: 'EXPLORER_TOGGLE' }
  | { type: 'EXPLORER_SYNC', files: any[] };

export type ZenContextValue = [ZenStateProps, (action: ZenAction) => void];

/**
 * Pure Factory for generating deterministic isolated state machines.
 */
export function createZenStore(): ZenContextValue {
  const [mode, setMode] = createSignal<'passive' | 'active'>('passive');
  const [lastKey, setKey] = createSignal<string>('NONE');
  const [tick, setTick] = createSignal<number>(0);
  const [explorerIndex, setExplorerIndex] = createSignal<number>(0);
  const [explorerFiles, setExplorerFiles] = createSignal<any[]>([]);

  const state: ZenStateProps = { mode, lastKey, tick, explorerIndex, explorerFiles };

  const dispatch = (action: ZenAction) => {
    switch (action.type) {
      case 'KEY_PRESS':
        setTick(t => t + 1);
        setKey(action.key);
        
        // --- Sovereign Command Triggers (V150: Normalized) ---
        const isPassive = mode() === 'passive';
        if ((isPassive && action.key === 'space') || action.key === 'ctrl+backtick') {
          setMode('active');
        }

        // Return to Navigation (Passive)
        if (action.key === 'esc' || action.key === 'escape' || action.key === 'q') {
          setMode('passive');
        }
        break;
      case 'SET_MODE':
        setMode(action.mode);
        break;
      case 'EXPLORER_MOVE':
        setExplorerIndex(idx => {
          const next = idx + action.offset;
          return Math.max(0, Math.min(next, explorerFiles().length - 1));
        });
        break;
      case 'EXPLORER_TOGGLE':
        const currentFiles = explorerFiles();
        const selected = currentFiles[explorerIndex()];
        if (selected && selected.isDir) {
          selected.isOpen = !selected.isOpen;
          setExplorerFiles([...currentFiles]); // Trigger reactivity
        }
        break;
      case 'EXPLORER_SYNC':
        setExplorerFiles(action.files);
        break;
    }
    // Eagerly trigger rendering update safely if environment allows
    try { requestFrame(); } catch(e) { /* ignore in headless tests */ }
  };
  
  return [state, dispatch];
}

/**
 * Sovereign Singleton Factory
 * Utilizes globalThis to bridge across potential module duplication in monorepos.
 */
const ZEN_STORE_SYMBOL = Symbol.for('zen_tui_sovereign_store');

function getGlobalZenStore(): ZenContextValue {
  if (!(globalThis as any)[ZEN_STORE_SYMBOL]) {
    (globalThis as any)[ZEN_STORE_SYMBOL] = createZenStore();
  }
  return (globalThis as any)[ZEN_STORE_SYMBOL];
}

export const ZenStore = getGlobalZenStore();
export const [useZenState, useZenDispatch] = ZenStore;
