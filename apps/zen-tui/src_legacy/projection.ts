import { CommitSummary } from "../../types/core.js";
import { LogMode, LogRow } from "./model.js";

export function projectLogRows(commits: CommitSummary[], mode: LogMode): LogRow[] {
  return commits.map((commit) => ({
    hash: commit.shortHash,
    graphCells: [],
    badges: commit.tags ?? [],
    primary: commit.message,
    secondary: `${commit.author} ${commit.date}`,
    severity: mode === "surgery" ? "warn" : "default",
  }));
}
