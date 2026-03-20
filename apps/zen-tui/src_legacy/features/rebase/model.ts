import { CommitSummary } from "../../types/core.js";
import { OperationMeta } from "../operations/model.js";

// model: domain contracts and invaraints

export type RebaseAction = "pick" | "reword" | "edit" | "squash" | "fixup" | "drop";
export type RebaseScopeKind = "head_range" | "root" | "onto_ref" | "branch_refresh";
export type RebaseStage =
  | "idle"
  | "scope_draft"
  | "plan_draft"
  | "plan_invalid"
  | "plan_ready"
  | "running"
  | "stopped_for_edit"
  | "stopped_for_reword"
  | "stopped_for_squash_message"
  | "stopped_for_conflict"
  | "aborted"
  | "completed"
  | "failed";

export interface RebaseScope {
  kind: RebaseScopeKind;
  baseRef: string;
  includeRoot: boolean;
  preserveMerges: boolean;
  autosquash: boolean;
}

export interface RebasePlanItem extends CommitSummary {
  subject: string;
  action: RebaseAction;
  canMoveUp: boolean;
  canMoveDown: boolean;
  allowedActions: readonly RebaseAction[];
}

export type RebaseStopReason =
  | { kind: "edit"; commitHash: string }
  | { kind: "reword"; commitHash: string }
  | { kind: "squash_message"; commitHash: string; previousHash: string | null }
  | { kind: "conflict"; commitHash: string; files: string[] };

export interface RebaseValidationError {
  code: "EMPTY_PLAN" | "INVALID_FIRST_ACTION";
  message: string;
}

export interface RebaseRecoveryTarget {
  ref: string;
  label: string;
}

export interface RebaseRuntimeSnapshot {
  currentIndex: number | null;
  total: number;
  currentHash: string | null;
}

export interface RebaseState {
  stage: RebaseStage;
  meta: OperationMeta | null;
  sourceCommits: CommitSummary[];
  scope: RebaseScope | null;
  plan: RebasePlanItem[];
  selectedIndex: number;
  stopReason: RebaseStopReason | null;
  runtime: RebaseRuntimeSnapshot | null;
  messageBuffer: string;
  recoveryTarget: RebaseRecoveryTarget | null;
  validationErrors: RebaseValidationError[];
  lastError: string | null;
}
