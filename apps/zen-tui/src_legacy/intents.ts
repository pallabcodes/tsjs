import { FileStatus, LogTemplate, ViewType } from "../../types/core.js";
import { RebaseAction, RebaseScopeKind, RebaseState } from "../../features/rebase/model.js";

export type ShellAction =
  | { type: "SET_VIEW"; view: ViewType }
  | { type: "SET_SELECTED_COMMIT"; index: number }
  | { type: "TOGGLE_COMMIT_SELECTION"; hash: string }
  | { type: "SET_SELECTED_STATUS"; index: number }
  | { type: "SET_SELECTED_BRANCH"; index: number }
  | { type: "SET_SELECTED_STASH"; index: number }
  | { type: "SET_NOTIFICATION"; message: string; notificationType: "info" | "success" | "warning" | "error" }
  | { type: "CLEAR_NOTIFICATION" }
  | { type: "TOGGLE_COMMAND_PALETTE" }
  | { type: "SET_COMMAND_QUERY"; query: string }
  | { type: "SET_FOCUS"; panel: "MAIN" | "SIDE" }
  | { type: "SELECT_FILE"; file: FileStatus | null }
  | { type: "SET_LOG_TEMPLATE"; template: LogTemplate }
  | { type: "SET_LOG_LIMIT"; limit: number }
  | { type: "RESET_HARD"; commitHash: string }
  | { type: "RESET_SOFT"; commitHash: string }
  | { type: "CYCLE_THEME" }
  | { type: "STAGE_FILE"; path: string }
  | { type: "UNSTAGE_FILE"; path: string }
  | { type: "STAGE_ALL" }
  | { type: "START_COMMIT" }
  | { type: "CANCEL_COMMIT" }
  | { type: "SET_COMMIT_MESSAGE"; message: string }
  | { type: "FINISH_COMMIT" }
  | { type: "PUSH" }
  | { type: "STASH_CHANGES"; message: string }
  | { type: "POP_STASH"; id: number }
  | { type: "DROP_STASH"; id: number }
  | { type: "APPLY_STASH"; id: number }
  | { type: "SHOW_CONFIRM"; confirmType: string; message: string; payload?: unknown }
  | { type: "HIDE_CONFIRM" }
  | { type: "SCROLL_DIFF"; offset: number }
  | { type: "TOGGLE_HUNK_STAGING"; path: string; hunkIndex: number }
  | { type: "SET_SELECTED_HUNK"; index: number }
  | { type: "SET_REBASE_STATE"; state: RebaseState }
  | { type: "REBASE_SELECT_INDEX"; index: number }
  | { type: "REBASE_SET_ACTION"; index: number; action: RebaseAction }
  | { type: "REBASE_MOVE_ITEM"; from: number; to: number }
  | { type: "REBASE_CYCLE_SCOPE_KIND" }
  | { type: "REBASE_TOGGLE_SCOPE_OPTION"; option: "preserveMerges" | "autosquash" }
  | { type: "REBASE_CONFIRM_SCOPE" }
  | { type: "REBASE_SET_MESSAGE"; message: string }
  | { type: "RESOLVE_CONFLICT"; path: string };
