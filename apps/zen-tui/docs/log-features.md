# Zen-TUI Log: "God-Mode" Feature Specification

A high-finesse product must justify every line. Here is how Zen-TUI outperforms every existing tool.

## 1. Proactive "Early Warning" HUD (USP: Ancestral Clarity)
- **The Problem**: In Lazygit/GitKraken, you only see drift when you manually check remotes or try to rebase.
- **Competitor Flaw**: Reactive. You are told there is a conflict *after* it happens.
- **Zen-TUI Ingenuity**: The **Ancestral Engine** (Rust) continuously analyzes the merge-base between your HEAD and remotes. It predicts rebase success.
- **USP Alignment**: Solves **Context Decay**. You always know the "Freshness" of your branch without a single keystroke.

## 2. Surgical History Mutation (USP: Instant Identity)
- **The Problem**: Correcting an author message or pruning a commit in the middle of a stack is a multi-step CLI nightmare (Interactive Rebase).
- **Competitor Flaw**: Wrapped CLI. They just open a text editor for `git rebase -i`.
- **Zen-TUI Ingenuity**: **In-Memory Graph Mutation**. The Rust backend calculates the new topology instantly. The UI projects the *result* before the user confirms.
- **USP Alignment**: Solves **Workflow Fragmentation**. Fix metadata in 1s, not 10m.

## 3. Recovery-First Architecture (USP: The Safety Net)
- **The Problem**: Fear of breaking the repo during complex surgery.
- **Competitor Flaw**: Reliance on `git reflog` (manual recovery).
- **Zen-TUI Ingenuity**: **Atomic Recovery Targets**. Every mutation is preceded by a temporary `zen-recovery` ref bookmark. Rollback is a single state transition away.
- **USP Alignment**: Solves **Risk Aversion**. Encourages users to "clean up" their history aggressively.

---

## Technical Core (Taste-First)

### [Backend] `src/native/log.concept.rs`
- **Role**: Topology engine, Git streaming, and mutation calculation.
- **God-Mode**: Streams directly into buffer without full copy.

### [Frontend] `src/features/log/LogModule.concept.tsx`
- **Role**: Solid-js orchestration of the Log view.
- **God-Mode**: Reactive "Projections"—the UI only renders the visible slice of the graph.

### [Logic] `src/shared/engine.concept.ts`
- **Role**: The "Zen-Engine" (XState wrapper).
- **God-Mode**: Deterministic state transitions for all Git operations.
