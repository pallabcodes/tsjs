import {
  abort,
  begin,
  confirmScope,
  continueRuntime,
  createIdleRebaseState,
  cycleScopeKind,
  move,
  resolveConflict,
  selectPlanIndex,
  setAction,
  setMessage,
  skip,
  startFromSelection,
  startRoot,
  submitMessage,
  toggleScopeOption,
  validate,
} from "./engine.js";
import { createRebaseEffects } from "./effects.js";
import { rebasePresenter } from "./presenter.js";
import { rebaseSelectors } from "./selectors.js";
import { CommitSummary } from "../../types/core.js";
import { RebaseAction, RebaseState } from "./model.js";

// facade: the only public API

const effects = createRebaseEffects();

export const rebase = {
  createIdleState: createIdleRebaseState,
  startFromSelection(input: { commits: CommitSummary[]; selectedIndex: number; includeRoot: boolean; currentBranch: string }): RebaseState {
    return startFromSelection(input);
  },
  startRoot(input: { commits: CommitSummary[]; currentBranch: string }): RebaseState {
    return startRoot(input);
  },
  cycleScopeKind(state: RebaseState): RebaseState {
    return cycleScopeKind(state);
  },
  toggleScopeOption(state: RebaseState, option: "preserveMerges" | "autosquash"): RebaseState {
    return toggleScopeOption(state, option);
  },
  confirmScope(state: RebaseState): RebaseState {
    return confirmScope(state);
  },
  selectIndex(state: RebaseState, index: number): RebaseState {
    return selectPlanIndex(state, index);
  },
  setAction(state: RebaseState, input: { index: number; action: RebaseAction }): RebaseState {
    return setAction(state, input);
  },
  move(state: RebaseState, input: { from: number; to: number }): RebaseState {
    return move(state, input);
  },
  validate(state: RebaseState): RebaseState {
    return validate(state);
  },
  canBegin(state: RebaseState): boolean {
    return state.stage === "plan_ready";
  },
  getValidationErrors(state: RebaseState) {
    return state.validationErrors;
  },
  async begin(state: RebaseState): Promise<RebaseState> {
    await effects.startInteractiveRebase(state);
    return begin(state);
  },
  async continue(state: RebaseState): Promise<RebaseState> {
    await effects.continueInteractiveRebase(state);
    return continueRuntime(state);
  },
  async skip(state: RebaseState): Promise<RebaseState> {
    await effects.skipInteractiveRebase(state);
    return skip(state);
  },
  async abort(state: RebaseState): Promise<RebaseState> {
    await effects.abortInteractiveRebase(state);
    return abort(state);
  },
  setMessage(state: RebaseState, message: string): RebaseState {
    return setMessage(state, message);
  },
  async submitMessage(state: RebaseState): Promise<RebaseState> {
    await effects.submitInteractiveRebaseMessage(state);
    return submitMessage(state);
  },
  resolveConflict(state: RebaseState): RebaseState {
    return resolveConflict(state);
  },
  selectors: rebaseSelectors,
  presenter: rebasePresenter,
};
