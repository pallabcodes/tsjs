import { requestFrame, type ZenInputEvent } from '@zen-tui/solid';
import { setFooterModeSignal, setLastKey } from './state.js';

/**
 * Sovereign Action Controller (Global)
 */
export function handleSovereignInput(e: ZenInputEvent) {
  setLastKey(e.name || 'UNKNOWN');
  if (e.name === ':' || e.name === 'colon') {
    setFooterModeSignal('active');
    requestFrame();
  } else if (e.name === 'escape' || e.name === 'q') {
    setFooterModeSignal('passive');
    requestFrame();
  }
}
