import { RebaseState } from "./model.js";
import { rebaseSelectors } from "./selectors.js";

// presenter: domain-to-TUI projection

export interface RebaseScopeViewModel {
  title: string;
  options: Array<{ kind: string; label: string; active: boolean }>;
  settings: Array<{ label: string; enabled: boolean }>;
  summary: string;
}

export interface RebasePlanViewModel {
  title: string;
  scopeLabel: string;
  rows: Array<{ hash: string; subject: string; action: string; selected: boolean; dropped: boolean }>;
}

export interface RebaseRuntimeViewModel {
  title: string;
  reason: string;
  detail: string;
  actions: Array<{ key: string; label: string }>;
}

export function getScopeViewModel(state: RebaseState): RebaseScopeViewModel {
  return {
    title: rebaseSelectors.isSingleCommitRewrite(state) ? "Rewrite Commit" : "Rewrite History",
    options: [
      { kind: "head_range", label: "Selected range", active: state.scope?.kind === "head_range" },
      { kind: "root", label: "From root", active: state.scope?.kind === "root" },
      { kind: "onto_ref", label: "Onto another ref", active: state.scope?.kind === "onto_ref" },
      { kind: "branch_refresh", label: "Refresh onto dev", active: state.scope?.kind === "branch_refresh" },
    ],
    settings: [
      { label: "Preserve merges", enabled: state.scope?.preserveMerges ?? false },
      { label: "Autosquash", enabled: state.scope?.autosquash ?? false },
    ],
    summary: rebaseSelectors.getScopeLabel(state),
  };
}

export function getPlanViewModel(state: RebaseState): RebasePlanViewModel {
  return {
    title: rebaseSelectors.isSingleCommitRewrite(state) ? "Rewrite Plan" : "Interactive Rebase Plan",
    scopeLabel: rebaseSelectors.getScopeLabel(state),
    rows: state.plan.map((item, index) => ({
      hash: item.shortHash,
      subject: item.subject,
      action: item.action,
      selected: index === state.selectedIndex,
      dropped: item.action === "drop",
    })),
  };
}

export function getRuntimeViewModel(state: RebaseState): RebaseRuntimeViewModel {
  const stop = rebaseSelectors.getCurrentStop(state);
  const reason = stop?.kind === "edit"
    ? "Git paused so you can amend this commit."
    : stop?.kind === "reword"
      ? "Update the commit message before continuing."
      : stop?.kind === "squash_message"
        ? "Review the combined commit message."
        : stop?.kind === "conflict"
          ? "Resolve conflicts, then continue or skip."
          : "Rebase is running.";

  const detail = stop?.kind === "conflict"
    ? `Conflicting files: ${stop.files.join(", ")}`
    : state.runtime?.currentHash ?? "No active step";

  return {
    title: stop ? `Stopped: ${stop.kind}` : "Rebase Runtime",
    reason,
    detail,
    actions: rebaseSelectors.getAvailableActions(state),
  };
}

export const rebasePresenter = {
  getScopeViewModel,
  getPlanViewModel,
  getRuntimeViewModel,
};
