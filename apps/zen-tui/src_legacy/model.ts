import { Branch, Commit, ConfirmDialog, FileDiff, FileStatus, FocusPanel, LogTemplate, Notification, Stash, ThemeName, UpstreamAlert, ViewType } from "../../types/core.js";
import { RebaseState } from "../../features/rebase/model.js";

export interface AppShellState {
  activeView: ViewType;
  notification: Notification | null;
  isCommandPaletteOpen: boolean;
  commandQuery: string;
  focusedPanel: FocusPanel;
  selectedFile: FileStatus | null;
  logTemplate: LogTemplate;
  logLimit: number;
  themeName: ThemeName;
  upstreamAlert: UpstreamAlert | null;
  isCommitting: boolean;
  commitMessage: string;
  diffScrollOffset: number;
  selectedHunkIndex: number;
  confirmDialog: ConfirmDialog | null;
}

export interface AppState extends AppShellState {
  currentBranch: string;
  branches: Branch[];
  commits: Commit[];
  rebase: RebaseState;
  status: FileStatus[];
  stashes: Stash[];
  diffs: Map<string, FileDiff>;
  selectedCommitIndex: number;
  selectedCommitHashes: Set<string>;
  selectedStatusIndex: number;
  selectedBranchIndex: number;
  selectedStashIndex: number;
}
