---
name: zen-tui-workflow
description: L5-standard guide for implementing `apps/zen-tui` with feature-engine architecture, facade-first consumer APIs, and extreme code finesse. Use when working on Git workflow modules (rebase, log, etc.); when ensuring zero type errors, no `any`, and meaningful customizations; or when applying the "Taste-first" and "Log-projection-first" philosophies required for a premium Google-internal/commercial product.
---

# Zen-TUI Workflow (L5 Finesse Standard)

Use this skill for all work inside `apps/zen-tui`. This project is a high-stakes Google tool destined for commercialization. Every line of code must exhibit extreme finesse, performance, and type safety.

## 核心原则 (Core Principles)

1.  **Consumer-First DX (The "Taste" Rule)**: Design the `facade.ts` and data flow before touching any implementation. If using the module doesn't feel like a premium SDK, it is a failure.
2.  **Every Line Matters**: Zero type errors. No `any`. No `unknown` without explicit justification. Use native primitives unless a wrapper adds non-trivial semantic value.
3.  **Proactive Intelligence (The "USP" Rule)**: Features should focus on "Early Warning" (e.g., Branch Freshness) and "Recovery-First" (e.g., Rebase Safety). We don't just wrap commands; we engineer workflows.
4.  **Taste-First Design (.concept naming)**: ALL new features must start with conceptual designs using the `.concept.{ts,rs,md}` suffix.
5.  **Trace-Driven Specification (TDD)**: For complex engines (Log, Rebase), create a `trace.concept.json` and `verify.concept.ts` to "play out" user stories before implementation. This ensures the USP and DX are battle-tested.
6.  **Log-Projection Foundation**: The `log` module's projection logic is the source of truth for all commit visualizations. All "Write" workflows (Rebase, Cherry-pick) must consume Log projections for UI consistency.
6.  **Pure Feature Engines**: `engine.ts` must be 100% pure state transition logic. No Ink, no Git, no IO. Testable in isolation without a terminal.

## Meaningful Customization Rules

We only deviate from defaults or add wrappers when it adds **semantic value** or improves **efficiency/DX**:

-   **Types**: Extend built-in types, use `.d.ts` and module augmentation to ensure the codebase is 100% type-safe.
-   **FFI/Bindings**: Modify NAPI/FFI signatures or implementations if it improves performance or makes the consumer API more ergonomic.
-   **Wrappers**: Add thin wrappers for repeated semantics (e.g., `SelectionMgr`, `ProcessSupervisor`, `OutputBuffer`). Avoid "abstraction for the sake of abstraction."
-   **Existing Libs**: Build on top of existing libraries. Only fork or modify them if the current implementation hinders the "premium" requirement or efficiency.

## Implementation Checklist (L5)

### 1. The Facade (Public API)
- Does `facade.ts` read like a clean SDK?
- Are internals (model, engine, effects) hidden?
- Is it the **only** entry point for consumers?

### 2. The Engine (Pure Logic)
- Is it 100% pure? 
- Does it handle all state transitions without side effects?
- Is it decoupled from React/Ink and CLI output?

### 3. The Presenter (View Model)
- Does it handle **all** view-shaping?
- Are Ink components thin wrappers around the presenter's output?
- Is there **zero** business logic branching inside the JSX?

### 4. The Effects (Side Effects)
- Does it own all Git interactions and process lifecycles?
- Does it handle cleanup and resource management (e.g., `AbortController`)?
- Is it the only place where non-pure work happens?

### 5. Type Safety & Finesse
- Are there any `any` or `@ts-ignore`? (Remove them).
- Are types descriptive and exhaustive?
- Is the folder structure perfectly aligned with the feature-engine model?

## Workflow-Specific Finesse

-   **Log**: Focus on parsed projections (`focus`, `review`, `surgery`). Ensure rows are structured data, not strings.
-   **Rebase**: Explicitly model `idle` -> `scope` -> `plan` -> `runtime`. No "boolean soup." Ensure the Scope screen uses the Log module's projection.
-   **Cherry-pick**: Batch-first UX. Reorderable queue.
-   **Submodule**: Dashboard health summary first. Detailed model for SHA mismatches.

Read [references/architecture.md](references/architecture.md) for layer contracts and [references/meaningful-customization.md](references/meaningful-customization.md) for deep-dive examples of when to wrap vs. when to use native.
