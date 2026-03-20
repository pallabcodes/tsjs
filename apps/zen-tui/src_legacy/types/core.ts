import { ThemeName } from "../ui/theme.js";
export { ThemeName };

export type ViewType = "LOG" | "STATUS" | "BRANCHES" | "STASH" | "REBASE";
export type LogTemplate = "focus" | "review" | "surgery" | "graph";
export type FocusPanel = "MAIN" | "SIDE";

export interface Notification {
  message: string;
  type: "info" | "success" | "warning" | "error";
}

export interface ConfirmDialog {
  type: string;
  message: string;
  payload?: unknown;
}

export interface Commit {
  hash: string;
  shortHash: string;
  message: string;
  author: string;
  date: string;
  parents: string[];
  branch?: string;
  tags?: string[];
}

export type CommitSummary = Pick<Commit, "hash" | "shortHash" | "message" | "author" | "date" | "parents" | "branch" | "tags">;

export interface FileStatus {
  path: string;
  staged: boolean;
  stagedHunkIndexes?: number[];
  status: "M" | "A" | "D" | "R" | "??";
  additions?: number;
  deletions?: number;
}

export interface Branch {
  name: string;
  current: boolean;
  ahead: number;
  behind: number;
  lastCommit: string;
  remote?: string;
  upstream?: string;
}

export interface Stash {
  id: number;
  message: string;
  branch: string;
  hash: string;
  date: string;
  files: number;
}

export interface FileDiff {
  path: string;
  status: string;
  additions: number;
  deletions: number;
  hunks: Array<{
    header: string;
    lines: Array<{
      type: "add" | "del" | "ctx";
      content: string;
      oldLineNo?: number;
      newLineNo?: number;
    }>;
  }>;
}

export interface UpstreamAlert {
  branch: string;
  newCommits: number;
  authors: string[];
}
