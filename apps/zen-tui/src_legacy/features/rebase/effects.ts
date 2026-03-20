import { RebaseState } from "./model.js";

// effects: git/editor/process boundary

export interface RebaseEffects {
  startInteractiveRebase(state: RebaseState): Promise<void>;
  continueInteractiveRebase(state: RebaseState): Promise<void>;
  skipInteractiveRebase(state: RebaseState): Promise<void>;
  abortInteractiveRebase(state: RebaseState): Promise<void>;
  submitInteractiveRebaseMessage(state: RebaseState): Promise<void>;
}

function noop(): Promise<void> {
  return Promise.resolve();
}

export function createRebaseEffects(): RebaseEffects {
  return {
    startInteractiveRebase: noop,
    continueInteractiveRebase: noop,
    skipInteractiveRebase: noop,
    abortInteractiveRebase: noop,
    submitInteractiveRebaseMessage: noop,
  };
}
