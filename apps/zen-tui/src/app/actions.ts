import { requestFrame, type ZenInputEvent } from '@zen-tui/solid';
import { ZenState } from './state.js';

/**
 * ActionController: Pure Interaction Controller (V110)
 */
export const ActionController = {
  dispatch: (e: ZenInputEvent) => {
    ZenState.bumpTick();
    ZenState.setKey(e.name || 'UNK');
    requestFrame();
  }
};
