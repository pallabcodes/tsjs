import { CherryPickState } from "./model.js";

export function createIdleCherryPickState(): CherryPickState {
  return {
    stage: "idle",
    targetBranch: "",
    queue: [],
    selectedIndex: 0,
    noCommit: false,
    stopFiles: [],
    commitMessageBuffer: "",
    lastError: null,
  };
}
