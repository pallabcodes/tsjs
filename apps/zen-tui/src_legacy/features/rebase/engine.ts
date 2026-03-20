import { CommitSummary } from "../../types/core.js";
import { RebaseAction, RebasePlanItem, RebaseScope, RebaseScopeKind, RebaseStage, RebaseState, RebaseStopReason, RebaseValidationError } from "./model.js";

// engine: pure state transitions

const REBASE_SCOPE_ORDER: RebaseScopeKind[] = ["head_range", "root", "onto_ref", "branch_refresh"];
const AUTO_ADVANCE_ACTIONS: ReadonlySet<RebaseAction> = new Set(["pick", "drop", "fixup"]);

function now(): number {
  return Date.now();
}

function createMeta(headline: string, branch: string): RebaseState["meta"] {
  return {
    id: `rebase-${Math.random().toString(36).slice(2, 10)}`,
    startedAt: null,
    updatedAt: now(),
    branch,
    headline,
  };
}

function createScope(kind: RebaseScopeKind, baseRef: string, includeRoot: boolean): RebaseScope {
  return {
    kind,
    baseRef,
    includeRoot,
    preserveMerges: false,
    autosquash: false,
  };
}

export function createIdleRebaseState(): RebaseState {
  return {
    stage: "idle",
    meta: null,
    sourceCommits: [],
    scope: null,
    plan: [],
    selectedIndex: 0,
    stopReason: null,
    runtime: null,
    messageBuffer: "",
    recoveryTarget: null,
    validationErrors: [],
    lastError: null,
  };
}

function getAllowedActions(planLength: number, index: number): RebaseAction[] {
  if (planLength === 1) return ["reword", "edit", "drop"];
  if (index === 0) return ["pick", "reword", "edit", "drop"];
  return ["pick", "reword", "edit", "squash", "fixup", "drop"];
}

function toPlanItems(commits: CommitSummary[]): RebasePlanItem[] {
  return commits.map((commit, index, all) => {
    const allowedActions = getAllowedActions(all.length, index);
    return {
      ...commit,
      subject: commit.message,
      action: all.length === 1 ? "reword" : index === 0 ? "pick" : "pick",
      canMoveUp: index > 0,
      canMoveDown: index < all.length - 1,
      allowedActions,
    };
  });
}

function syncPlanMetadata(plan: RebasePlanItem[]): RebasePlanItem[] {
  return plan.map((item, index, all) => {
    const allowedActions = getAllowedActions(all.length, index);
    const safeAction = allowedActions.includes(item.action) ? item.action : allowedActions[0]!;
    return {
      ...item,
      action: safeAction,
      canMoveUp: index > 0,
      canMoveDown: index < all.length - 1,
      allowedActions,
    };
  });
}

function validatePlan(plan: RebasePlanItem[]): RebaseValidationError[] {
  const errors: RebaseValidationError[] = [];
  if (plan.length === 0) {
    errors.push({ code: "EMPTY_PLAN", message: "Rebase plan cannot be empty." });
  }
  if (plan[0] && (plan[0].action === "squash" || plan[0].action === "fixup")) {
    errors.push({ code: "INVALID_FIRST_ACTION", message: "The first commit cannot be squash or fixup." });
  }
  return errors;
}

function scopeLabel(scope: RebaseScope, commitCount: number): string {
  switch (scope.kind) {
    case "root":
      return "--root";
    case "branch_refresh":
      return "refresh onto dev";
    case "onto_ref":
      return `onto ${scope.baseRef}`;
    case "head_range":
    default:
      return scope.includeRoot ? "--root" : `HEAD~${commitCount}`;
  }
}

function withUpdatedMeta(state: RebaseState): RebaseState {
  return state.meta ? { ...state, meta: { ...state.meta, updatedAt: now() } } : state;
}

export function startFromSelection(input: {
  commits: CommitSummary[];
  selectedIndex: number;
  includeRoot: boolean;
  currentBranch: string;
}): RebaseState {
  const count = Math.min(input.selectedIndex + 1, input.commits.length);
  const sourceCommits = input.includeRoot ? input.commits : input.commits.slice(0, count);
  const kind: RebaseScopeKind = input.includeRoot || count >= input.commits.length ? "root" : "head_range";
  return {
    ...createIdleRebaseState(),
    stage: "scope_draft",
    meta: createMeta(sourceCommits.length === 1 ? "Rewrite Commit" : "Interactive Rebase", input.currentBranch),
    sourceCommits,
    scope: createScope(kind, kind === "root" ? "--root" : `HEAD~${count}`, kind === "root"),
    recoveryTarget: { ref: "ORIG_HEAD", label: "ORIG_HEAD" },
  };
}

export function startRoot(input: { commits: CommitSummary[]; currentBranch: string }): RebaseState {
  return {
    ...createIdleRebaseState(),
    stage: "scope_draft",
    meta: createMeta("Interactive Rebase", input.currentBranch),
    sourceCommits: input.commits,
    scope: createScope("root", "--root", true),
    recoveryTarget: { ref: "ORIG_HEAD", label: "ORIG_HEAD" },
  };
}

export function cycleScopeKind(state: RebaseState): RebaseState {
  if (!state.scope || state.stage === "idle") return state;
  const currentIndex = REBASE_SCOPE_ORDER.indexOf(state.scope.kind);
  const nextKind = REBASE_SCOPE_ORDER[(currentIndex + 1) % REBASE_SCOPE_ORDER.length]!;
  const nextScope = createScope(
    nextKind,
    nextKind === "root" ? "--root" : nextKind === "branch_refresh" ? "dev" : state.scope.baseRef,
    nextKind === "root",
  );
  return withUpdatedMeta({ ...state, scope: nextScope });
}

export function toggleScopeOption(state: RebaseState, option: "preserveMerges" | "autosquash"): RebaseState {
  if (!state.scope) return state;
  return withUpdatedMeta({
    ...state,
    scope: { ...state.scope, [option]: !state.scope[option] },
  });
}

export function confirmScope(state: RebaseState): RebaseState {
  if (!state.scope) return state;
  const plan = syncPlanMetadata(toPlanItems(state.sourceCommits));
  const next = withUpdatedMeta({
    ...state,
    stage: "plan_draft",
    plan,
    selectedIndex: 0,
    validationErrors: [],
  });
  return validate(next);
}

export function setAction(state: RebaseState, input: { index: number; action: RebaseAction }): RebaseState {
  const plan = [...state.plan];
  const item = plan[input.index];
  if (!item) return state;
  const allowedActions = getAllowedActions(plan.length, input.index);
  plan[input.index] = { ...item, action: allowedActions.includes(input.action) ? input.action : item.action };
  return validate(withUpdatedMeta({ ...state, plan: syncPlanMetadata(plan) }));
}

export function move(state: RebaseState, input: { from: number; to: number }): RebaseState {
  const plan = [...state.plan];
  const [item] = plan.splice(input.from, 1);
  if (!item) return state;
  plan.splice(input.to, 0, item);
  return validate(withUpdatedMeta({ ...state, plan: syncPlanMetadata(plan), selectedIndex: input.to }));
}

export function setMessage(state: RebaseState, message: string): RebaseState {
  return withUpdatedMeta({ ...state, messageBuffer: message });
}

export function selectPlanIndex(state: RebaseState, index: number): RebaseState {
  return withUpdatedMeta({ ...state, selectedIndex: index });
}

export function validate(state: RebaseState): RebaseState {
  const validationErrors = validatePlan(state.plan);
  const stage: RebaseStage = validationErrors.length > 0 ? "plan_invalid" : state.plan.length > 0 ? "plan_ready" : "plan_draft";
  return withUpdatedMeta({ ...state, stage, validationErrors });
}

function stopForAction(state: RebaseState, index: number): RebaseState {
  const item = state.plan[index];
  if (!item) return complete(state);

  if (index === 3 && state.plan.length >= 5 && state.stopReason?.kind !== "conflict") {
    return withUpdatedMeta({
      ...state,
      stage: "stopped_for_conflict",
      stopReason: { kind: "conflict", commitHash: item.hash, files: ["src/app.ts"] },
      runtime: { currentIndex: index, total: state.plan.length, currentHash: item.hash },
      messageBuffer: "",
    });
  }

  switch (item.action) {
    case "edit":
      return withUpdatedMeta({
        ...state,
        stage: "stopped_for_edit",
        stopReason: { kind: "edit", commitHash: item.hash },
        runtime: { currentIndex: index, total: state.plan.length, currentHash: item.hash },
        messageBuffer: "",
      });
    case "reword":
      return withUpdatedMeta({
        ...state,
        stage: "stopped_for_reword",
        stopReason: { kind: "reword", commitHash: item.hash },
        runtime: { currentIndex: index, total: state.plan.length, currentHash: item.hash },
        messageBuffer: item.subject,
      });
    case "squash": {
      const previous = state.plan[index - 1];
      return withUpdatedMeta({
        ...state,
        stage: "stopped_for_squash_message",
        stopReason: { kind: "squash_message", commitHash: item.hash, previousHash: previous?.hash ?? null },
        runtime: { currentIndex: index, total: state.plan.length, currentHash: item.hash },
        messageBuffer: `${previous?.subject ?? ""}\n\n${item.subject}`.trim(),
      });
    }
    case "pick":
    case "drop":
    case "fixup":
      return advance(state, index + 1);
    default:
      return complete(state);
  }
}

function advance(state: RebaseState, nextIndex: number): RebaseState {
  if (nextIndex >= state.plan.length) return complete(state);
  return stopForAction(
    withUpdatedMeta({
      ...state,
      stage: "running",
      runtime: { currentIndex: nextIndex, total: state.plan.length, currentHash: state.plan[nextIndex]?.hash ?? null },
      stopReason: null,
      messageBuffer: "",
    }),
    nextIndex,
  );
}

export function begin(state: RebaseState): RebaseState {
  if (state.validationErrors.length > 0) return { ...state, stage: "plan_invalid" };
  return advance(withUpdatedMeta({ ...state, stage: "running" }), 0);
}

export function continueRuntime(state: RebaseState): RebaseState {
  if (!state.runtime || state.runtime.currentIndex === null) return state;
  return advance(withUpdatedMeta({ ...state, stopReason: null }), state.runtime.currentIndex + 1);
}

export function skip(state: RebaseState): RebaseState {
  if (!state.runtime || state.runtime.currentIndex === null) return state;
  return advance(withUpdatedMeta({ ...state, stopReason: null }), state.runtime.currentIndex + 1);
}

export function submitMessage(state: RebaseState): RebaseState {
  if (!state.runtime || state.runtime.currentIndex === null) return state;
  const plan = [...state.plan];
  const item = plan[state.runtime.currentIndex];
  if (!item) return state;
  plan[state.runtime.currentIndex] = { ...item, subject: state.messageBuffer, message: state.messageBuffer };
  return continueRuntime(withUpdatedMeta({ ...state, plan, stopReason: null }));
}

export function resolveConflict(state: RebaseState): RebaseState {
  if (state.stage !== "stopped_for_conflict") return state;
  return withUpdatedMeta({
    ...state,
    stage: "stopped_for_edit",
    stopReason: state.runtime?.currentHash ? { kind: "edit", commitHash: state.runtime.currentHash } : null,
  });
}

export function abort(state: RebaseState): RebaseState {
  return withUpdatedMeta({
    ...state,
    stage: "aborted",
    stopReason: null,
    runtime: null,
    messageBuffer: "",
  });
}

export function fail(state: RebaseState, error: string): RebaseState {
  return withUpdatedMeta({ ...state, stage: "failed", lastError: error });
}

export function complete(state: RebaseState): RebaseState {
  return withUpdatedMeta({
    ...state,
    stage: "completed",
    stopReason: null,
    runtime: null,
    messageBuffer: "",
  });
}

export function getScopeLabel(state: RebaseState): string {
  if (!state.scope) return "";
  return scopeLabel(state.scope, state.sourceCommits.length);
}

export function canAutoAdvance(action: RebaseAction): boolean {
  return AUTO_ADVANCE_ACTIONS.has(action);
}
