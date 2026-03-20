export interface CherryPickItem {
  hash: string;
  shortHash: string;
  subject: string;
}

export interface CherryPickState {
  stage: "idle" | "selecting" | "reviewing_batch" | "running" | "stopped_for_conflict" | "awaiting_commit_message" | "completed" | "aborted" | "failed";
  targetBranch: string;
  queue: CherryPickItem[];
  selectedIndex: number;
  noCommit: boolean;
  stopFiles: string[];
  commitMessageBuffer: string;
  lastError: string | null;
}
