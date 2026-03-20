import { Commit, FileStatus, Branch, Stash, FileDiff } from "../types/index.js";
import { AppState } from "../app/shell/model.js";

const MESSAGES = [
  "feat: add custom TUI renderer with Ink",
  "fix: resolve input handler race condition",
  "chore: update dependencies to latest",
  "feat: implement branch switching workflow",
  "Merge branch 'dev' into main",
  "refactor: extract state management to context",
  "feat: add stash pop and apply commands",
  "fix: correct scrollbar offset calculation",
  "docs: update README with keybindings",
  "fix: critical security vulnerability in auth",
  "feat: add multi-select for cherry-pick",
  "chore: lint and format codebase",
  "feat: implement interactive rebase editor",
  "refactor: move theme to dedicated module",
  "test: add unit tests for reducer",
  "feat: add commit graph visualization",
  "fix: handle empty repository gracefully",
  "feat: implement fuzzy command palette",
  "chore: CI pipeline for automated builds",
  "feat: add diff preview in side panel",
  "fix: tab switching drops focus state",
  "feat: implement reset --hard support",
  "Merge pull request #42 from feature/auth",
  "feat: add log template switching",
  "fix: rebase root commit handling",
];

const AUTHORS = ["Pallab", "Alice", "Bob", "CI Bot"];
const BRANCHES_ASSIGN = ["main", "main", "main", "main", "main", "dev", "dev", "dev", "dev", "dev",
  "feature/auth-flow", "feature/auth-flow", "feature/auth-flow", "feature/auth-flow", "feature/auth-flow",
  "main", "main", "dev", "dev", "main", "main", "main", "main", "main", "main"];

export function getMockRepoState(): Partial<AppState> {
  const commits: Commit[] = [];
  for (let i = 0; i < 25; i++) {
    const d = 25 - i;
    commits.push({
      hash: `${String.fromCharCode(97 + (i % 26))}${i}f${i * 3}c${i * 7}d${i}e${i + 10}`,
      shortHash: `${String.fromCharCode(97 + (i % 26))}${i.toString().padStart(2, "0")}f${i * 3}`,
      message: MESSAGES[i] || `chore: update ${i}`,
      author: AUTHORS[i % AUTHORS.length]!,
      date: `2026-03-${d.toString().padStart(2, "0")} ${(9 + (i % 12)).toString().padStart(2, "0")}:${(i * 7 % 60).toString().padStart(2, "0")}`,
      parents: i === 4 ? [`hash_5`, `hash_14`] : i === 22 ? [`hash_23`, `hash_12`] : i < 24 ? [`hash_${i + 1}`] : [],
      branch: BRANCHES_ASSIGN[i],
      tags: i === 0 ? ["v2.1.0"] : i === 9 ? ["v2.0.0"] : undefined,
    });
  }

  const branches: Branch[] = [
    { name: "main", current: true, ahead: 0, behind: 0, lastCommit: commits[0]!.shortHash, remote: "origin/main", upstream: "origin/main" },
    { name: "dev", current: false, ahead: 3, behind: 1, lastCommit: commits[5]!.shortHash, remote: "origin/dev", upstream: "origin/dev" },
    { name: "feature/auth-flow", current: false, ahead: 5, behind: 3, lastCommit: commits[10]!.shortHash },
    { name: "feature/zen-tui-init", current: false, ahead: 1, behind: 0, lastCommit: commits[2]!.shortHash },
    { name: "hotfix/security-patch", current: false, ahead: 2, behind: 0, lastCommit: commits[9]!.shortHash },
  ];

  const status: FileStatus[] = [
    { path: "src/renderer/index.ts", staged: true, status: "M", additions: 45, deletions: 12 },
    { path: "src/components/App.tsx", staged: true, status: "M", additions: 20, deletions: 5 },
    { path: "src/store/index.tsx", staged: true, status: "M", additions: 150, deletions: 40 },
    { path: "src/utils/git.ts", staged: false, status: "M", additions: 15, deletions: 8 },
    { path: "src/index.tsx", staged: false, status: "M", additions: 5, deletions: 0 },
    { path: "package.json", staged: false, status: "M", additions: 10, deletions: 2 },
    { path: "native/src/lib.rs", staged: false, status: "??" },
    { path: "docs/CHANGELOG.md", staged: false, status: "??" },
    { path: "src/super_large_component.tsx", staged: false, status: "M", additions: 12000, deletions: 3000 },
  ];

  const stashes: Stash[] = [
    { id: 0, message: "WIP: renderer refactor", branch: "main", hash: "s0t1u2v", date: "2026-03-18 14:20", files: 4 },
    { id: 1, message: "Experimental: new graph algo", branch: "dev", hash: "w3x4y5z", date: "2026-03-17 09:15", files: 1 },
    { id: 2, message: "Backup: before rebase", branch: "feature/auth-flow", hash: "a6b7c8d", date: "2026-03-15 18:45", files: 12 },
  ];

  // Mock diff for the 15K line component
  const largeDiff: FileDiff = {
    path: "src/super_large_component.tsx",
    status: "M",
    additions: 12000,
    deletions: 3000,
    hunks: Array.from({ length: 50 }, (_, hIdx) => ({
      header: `@@ -${hIdx * 300},20 +${hIdx * 300},25 @@`,
      lines: Array.from({ length: 30 }, (_, lIdx) => ({
        type: lIdx % 5 === 0 ? "add" : lIdx % 5 === 1 ? "del" : "ctx",
        content: `// Line ${hIdx * 300 + lIdx} of 15000: some code goes here... ${Math.random().toString(36).substring(7)}`,
        oldLineNo: hIdx * 300 + lIdx,
        newLineNo: hIdx * 300 + lIdx + 5
      }))
    }))
  };

  const diffs = new Map<string, FileDiff>();
  diffs.set("src/super_large_component.tsx", largeDiff);

  return {
    currentBranch: "main",
    branches,
    commits,
    status,
    stashes,
    diffs,
    logTemplate: "focus",
    logLimit: 20,
    upstreamAlert: { branch: "dev", newCommits: 3, authors: ["Alice", "Bob"] },
    themeName: "midnight",
  };
}
