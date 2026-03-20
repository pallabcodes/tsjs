export interface SubmoduleStatus {
  path: string;
  url: string;
  branch: string | null;
  initialized: boolean;
  detached: boolean;
  dirty: boolean;
  recordedSha: string | null;
  checkedOutSha: string | null;
  ahead: number;
  behind: number;
}

export interface SubmoduleState {
  stage: "idle" | "loading" | "ready" | "running" | "failed";
  modules: SubmoduleStatus[];
  selectedPath: string | null;
}
