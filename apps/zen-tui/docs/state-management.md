# Zen-TUI State Management: Strategy (L5 Proposal)

To ensure **L5 Finesse** and avoid "boolean soup" as the project scales, we must move beyond primitive `createContext`.

## The Decision: Option B (Modified/Extended)

We will use a **"Dual-Engine"** approach that leverages modern standards for both UI reactivity and business logic.

### 1. App Shell Store: `solid-js/store` (Customized)
- **Why**: Solid's `createStore` + `produce` provides high-performance, fine-grained reactivity without the overhead of a full library like Redux.
- **Customization**: We will wrap it in a **"Facade-Aware Store"** pattern. The UI never interacts with the store directly; it only uses the feature `facade.ts` which orchestrates the store.
- **Focus**: Global concerns like `activePanel`, `theme`, and `notificationQueue`.

## The "Zen-Engine" (Meaningful Customization)

We will not use XState "naked." We will build a **Zen-Engine** wrapper (approximately 100-200 lines of high-finesse TS) that provides:

1.  **Actor-Git Protocol**: A standard way for the machine to "spawn" Git processes and pipe their output into state transitions.
2.  **Snapshot-Restore Hook**: Built-in support for our "Recovery-First" USP. Every transition can optionally trigger a Git snapshot (Recovery Target).
3.  **TUI-First Interop**: Direct binding to Solid-js reactivity, so the UI "glows" automatically as the machine enters specific states (e.g., `conflict_active`).

This is **Option B+**: Taking the industry standard (XState) and engineering a custom "Super-Smart" layer on top that is uniquely suited for a Git TUI.

## Why this is "Super-Smart" & "Ingenious"

1.  **Actor Model Readiness**: By modeling features as state machines in XState, we prepare the app for seamless integration with the **Rust native runtime**. Rust can send "Events" (Git output, process exit) that directly trigger transitions in XState.
2.  **Zero-Leak Architecture**: The UI (Ink components) is 100% reactive to the state slice provided by the presenter, while the complex decision-making is isolated in the transition machine.
3.  **Auditability**: Every USP (like "Safe Pruning") becomes a transition guard in the state machine, preventing illegal states by design.

## Proposed Naming & Structure (Taste Pass)

- `src/features/log/machine.concept.ts`: The XState formal machine.
- `src/app/shell/store.concept.ts`: The Solid store for shell orchestration.
- `src/app/shell/facade.concept.ts`: The unified entry point that connects the store to the UI.

Does this "Solid + XState" hybrid align with your vision of a high-caliber Google-level product?
