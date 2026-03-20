# Zen-TUI: Problem Statement & USPs

## The Problem

High-seniority (L5+) engineers across Google deal with "Workflow Fragmentation" and "Context Decay." Existing tools (Lazygit, GitKraken, IDE built-ins) often fall short in these areas:

1.  **Workflow Inconsistency**: Submodule, Rebase, and Reset operations have different "quirks" across different tools/IDEs, leading to unpredictable outcomes and manual cleanup.
2.  **Upstream Blindness**: Working on a long-lived feature branch (e.g., `feature/xyz`) often leads to "Merge Shock" because tools don't proactively surface how far `dev` has moved or where potential conflicts are brewing.
3.  **Audit & Identity Friction**: Correcting commit metadata (author/email) or safely pruning sensitive/accidental commits is often a multi-step CLI dance or a clumsy UI process.
4.  **Information Overload**: Standard `git log` output is optimized for history, not for the current *task* (e.g., "Surgery" on a specific feature set vs. "Review" of a PR).

## Unique Selling Points (USPs)

Zen-TUI solves these by being an **"Opinionated Workflow Engine"** rather than a command wrapper.

### 1. Ingenious Upstream Awareness (The "Early Warning System")
- **The Feature**: PROACTIVE branch freshness analysis integrated directly into the HUD.
- **The Value**: Zen-TUI tells you *before* you rebase if `dev` has moved and *exactly* which commits will conflict. It’s not a notification; it’s a prerequisite for the rebase flow.

### 2. High-Finesse Rebase & Recovery (The "Safety First" Rebase)
- **The Feature**: A three-screen staged workflow (**Scope** -> **Plan** -> **Runtime**) with a guaranteed **Recovery Target**.
- **The Value**: Safely include/exclude root commits, batch-reword, squash, and fixup with a 100% predictable "Abort to Original HEAD" safety net. No more "boolean soup" in your rebase state.

### 3. Task-Oriented Log Projections
- **The Feature**: Dynamic projections (**Focus**, **Review**, **Surgery**, **Graph**) that replace generic commit lists.
- **The Value**: "Surgery" mode highlights only the commits currently being reordered/edited, while "Review" mode optimizes for reading diffs and ancestry. 

### 4. Native Runtime Discipline
- **The Feature**: A Rust-based `ProcessSupervisor` and `OutputBuffer` that handles Git subprocesses.
- **The Value**: Zero-clutter execution. Interactive AND non-interactive merge conflict solving that feels like a native IDE tool, not a Vim wrapper.

### 5. Instant Identity & Pruning
- **The Feature**: First-class support for single-commit "Surgery" (Author name/email update, commit pruning).
- **The Value**: One-click identity correction and "Safe Delete" for the last N commits, with architectural guards against accidental data loss.

## Competitive Comparison

| Feature | Lazygit | GitKraken | **Zen-TUI** |
| :--- | :---: | :---: | :---: |
| **Philosophy** | Broad/Manual | Visual/GUI | **Intelligent/Engine** |
| **Architecture** | Flat | Closed | **Facade-First SDK** |
| **Upstream Awareness** | Passive | Good | **Proactive (HUD)** |
| **Rebase Finesse** | Clumsy (Multiple Layers) | Visual | **Staged & Safe** |
| **Custom Projections** | Limited | No | **Task-Oriented** |
| **Identity Management** | CLI-heavy | GUI-based | **Instant/Finesse** |
