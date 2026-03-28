# Log Taste: The "Stealth Rebase" Scenario

**User Story**: An L5 engineer is deep in `feature/xyz`. They want to know if they should rebase now or later.

## 1. The Observation (Glow)
- The user is scrolling the Log. 
- The **Freshness HUD** at the top right glows **Amber**.
- User hovers over the HUD (or uses a hotkey).
- **Taste**: A popover reveals: *"Upstream `dev` has 3 new commits. One modifies `src/engine/git.ts`, which you also modified. Conflict highly likely."*

## 2. The Decision (Pre-Visualization)
- The user doesn't run `git rebase` yet.
- They press `V` (Visualize Rebase).
- **Taste**: The Log projection changes to **Mutation Mode**. It shows a "Ghost Branch" of how your commits would look on top of the new `dev`.
- The user sees the conflict point clearly highlighted in red.

## 3. The Action (Identity Correction mid-flow)
- While in this view, the user notices they used the wrong email for the last 3 commits.
- They press `I`. Select "Update Identity".
- **Zen-Engine** takes a recovery snapshot and performs the mutation.
- **Taste**: The Log re-renders instantly. The SHAs change, but your selection and scroll position are preserved.

## Why this is Ingenious:
- **Zero Interruption**: The user diagnosed a conflict, fixed authorship, and decided on a rebase strategy without ever checking their email or running a manual `git log`.
