/**
 * Zen-TUI: Git Service
 *
 * Pure TypeScript Git operations using child_process.
 * This is the fallback layer when the Rust N-API binary is unavailable.
 * In production, hot paths would be replaced by the native engine.
 * --
 * My feedback: this file fine as it is
 */

import { execSync } from "child_process"

export interface GitCommit {
  sha: string
  shortSha: string
  author: string
  email: string
  date: string
  subject: string
  refs: string
  parents: string[]
}

export interface GitFileStatus {
  path: string
  status: "staged" | "unstaged" | "untracked" | "conflict"
  indicator: string // e.g. "M", "A", "D", "??"
}

export interface GitBranch {
  name: string
  isCurrent: boolean
  upstream: string | null
  aheadBehind: string
}

export interface GitDiffHunk {
  filePath: string
  diff: string
}

function git(cmd: string, cwd?: string): string {
  try {
    return execSync(`git ${cmd}`, {
      cwd: cwd || process.cwd(),
      encoding: "utf-8",
      maxBuffer: 10 * 1024 * 1024,
    }).trim()
  } catch {
    return ""
  }
}

export function getLog(limit = 100): GitCommit[] {
  const raw = git(
    `log --format="%H|%h|%an|%ae|%ar|%s|%D|%P" -n ${limit} --topo-order`
  )
  if (!raw) return []

  return raw.split("\n").map((line) => {
    const [sha, shortSha, author, email, date, subject, refs, parentStr] =
      line.split("|")
    return {
      sha: sha || "",
      shortSha: shortSha || "",
      author: author || "",
      email: email || "",
      date: date || "",
      subject: subject || "",
      refs: refs || "",
      parents: parentStr ? parentStr.split(" ").filter(Boolean) : [],
    }
  })
}

export function getGraphLog(limit = 60): string[] {
  const raw = git(
    `log --graph --oneline --decorate --all -n ${limit}`
  )
  if (!raw) return []
  return raw.split("\n")
}

export function getStatus(): GitFileStatus[] {
  const raw = git("status --porcelain=v1")
  if (!raw) return []

  return raw.split("\n").map((line) => {
    const xy = line.substring(0, 2)
    const path = line.substring(3)
    let status: GitFileStatus["status"] = "unstaged"

    if (xy === "??") status = "untracked"
    else if (xy === "UU" || xy === "AA" || xy === "DD") status = "conflict"
    else if (xy[0] !== " " && xy[0] !== "?") status = "staged"
    else status = "unstaged"

    return { path, status, indicator: xy.trim() }
  })
}

export function getBranches(): GitBranch[] {
  const raw = git("branch -vv --no-color")
  if (!raw) return []

  return raw.split("\n").map((line) => {
    const isCurrent = line.startsWith("*")
    const trimmed = line.replace(/^\*?\s+/, "")
    const parts = trimmed.split(/\s+/)
    const name = parts[0] || ""

    // Extract upstream info from [origin/branch] pattern
    const upstreamMatch = trimmed.match(/\[([^\]]+)\]/)
    const upstream = upstreamMatch ? upstreamMatch[1] : null
    const aheadBehind = upstream
      ? upstream.replace(/^[^:]+:?\s*/, "").trim() || "tracking"
      : ""

    return { name, isCurrent, upstream, aheadBehind }
  })
}

export function getCurrentBranch(): string {
  return git("branch --show-current") || "HEAD"
}

export function getDiff(staged = false): string {
  return git(staged ? "diff --cached" : "diff")
}

export function getFileDiff(path: string, staged = false): string {
  return git(staged ? `diff --cached -- "${path}"` : `diff -- "${path}"`)
}

export function stageFile(path: string): void {
  git(`add "${path}"`)
}

export function unstageFile(path: string): void {
  git(`reset HEAD -- "${path}"`)
}

export function checkoutBranch(name: string): string {
  return git(`checkout "${name}"`)
}

export function commit(message: string): string {
  return git(`commit -m "${message.replace(/"/g, '\\"')}"`)
}

export function getUpstreamDrift(): { ahead: number; behind: number } {
  const raw = git("rev-list --left-right --count HEAD...@{upstream}")
  if (!raw) return { ahead: 0, behind: 0 }
  const [ahead, behind] = raw.split("\t").map(Number)
  return { ahead: ahead || 0, behind: behind || 0 }
}
