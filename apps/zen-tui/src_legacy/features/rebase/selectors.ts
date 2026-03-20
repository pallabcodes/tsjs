import { RebaseAction, RebasePlanItem, RebaseState } from "./model.js";
import { getScopeLabel } from "./engine.js";

// selectors: stable reads for consumers

export function getSelectedPlanItem(state: RebaseState): RebasePlanItem | null {
  return state.plan[state.selectedIndex] ?? null;
}

export function getCurrentStop(state: RebaseState) {
  return state.stopReason;
}

export function canAbort(state: RebaseState): boolean {
  return !["idle", "completed", "aborted"].includes(state.stage);
}

export function canContinue(state: RebaseState): boolean {
  return state.stage === "stopped_for_edit" || state.stage === "stopped_for_conflict";
}

export function canSkip(state: RebaseState): boolean {
  return state.stage === "stopped_for_edit" || state.stage === "stopped_for_conflict";
}

export function isSingleCommitRewrite(state: RebaseState): boolean {
  return state.sourceCommits.length === 1;
}

export function isRootRebase(state: RebaseState): boolean {
  return state.scope?.kind === "root" || state.scope?.includeRoot === true;
}

export function isScopeDraft(state: RebaseState): boolean {
  return state.stage === "scope_draft";
}

export function isPlanStage(state: RebaseState): boolean {
  return state.stage === "plan_draft" || state.stage === "plan_invalid" || state.stage === "plan_ready";
}

export function isRuntimeStage(state: RebaseState): boolean {
  return ["running", "stopped_for_edit", "stopped_for_reword", "stopped_for_squash_message", "stopped_for_conflict"].includes(state.stage);
}

export function isMessageStage(state: RebaseState): boolean {
  return state.stage === "stopped_for_reword" || state.stage === "stopped_for_squash_message";
}

export function getAvailableActions(state: RebaseState): Array<{ key: string; label: string }> {
  if (state.stage === "scope_draft") {
    return [
      { key: "a", label: "Cycle scope" },
      { key: "m", label: "Toggle preserve merges" },
      { key: "u", label: "Toggle autosquash" },
      { key: "Enter", label: "Confirm scope" },
      { key: "Esc", label: "Abort" },
    ];
  }
  if (isPlanStage(state)) {
    return [
      { key: "p/w/e/s/f/d", label: "Set action" },
      { key: "J/K", label: "Move commit" },
      { key: "Enter", label: "Begin" },
      { key: "Esc", label: "Abort" },
    ];
  }
  if (isMessageStage(state)) {
    return [
      { key: "Enter", label: "Submit message" },
      { key: "Esc", label: "Abort" },
    ];
  }
  if (canContinue(state) || canSkip(state)) {
    return [
      { key: "Enter", label: "Continue" },
      { key: "k", label: "Skip" },
      { key: "Esc", label: "Abort" },
    ];
  }
  return [];
}

export const rebaseSelectors = {
  getSelectedPlanItem,
  getCurrentStop,
  getAvailableActions,
  canAbort,
  canContinue,
  canSkip,
  isSingleCommitRewrite,
  isRootRebase,
  isScopeDraft,
  isPlanStage,
  isRuntimeStage,
  isMessageStage,
  getScopeLabel,
};
