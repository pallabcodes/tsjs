# Zen-TUI Workflow Architecture (Source of Truth)

## Purpose

`zen-tui` should treat advanced Git behavior as feature engines with a facade-first consumer API. This project adheres to **L5 Finesse Standards**: every line must be efficient, type-safe, and professional.

## Finesse & Quality Standards (L5)

> [!IMPORTANT]
> This project is a high-stakes tool for Google-wide use and commercialization.

-   **Zero Type Errors**: Compiling with zero TS errors is a mandatory requirement.
-   **No `any` or `unknown`**: Unless strictly justified, these are forbidden. Use `.d.ts` and module augmentation to fix library types.
-   **Meaningful Customization**: Extend built-in types and modify FFI/NAPI bindings only if it improves DX or performance. Avoid "reinventing the wheel."
-   **Premium UX**: Better than `lazygit`. No clutter. Smooth transitions. Efficient management of multiple commits.

## Target Structure

```ts
src/
  app/
    shell/              // Navigation, focus, theme, overlays
    runtime/            // Process supervision, resource cleanup
  features/
    log/                // FOUNDATIONAL: Parsing & graph projection
    rebase/             // Rebase module (consumes log projection)
    cherry-pick/        // Cherry-pick module
    submodule/          // Submodule dashboard & engine
    branch-freshness/   // HUDS & Proactive upstream analysis (USP: Early Warning)
  lib/                  // Meaningful wrappers (collections, refs)
  components/           // Thin Ink wrappers around presenters
```

## Layer Contract (Zero-Crossover)

-   **`model.ts`**: Exhaustive types, state machine, invariants.
-   **`engine.ts`**: Pure mathematical transitions. Zero side effects.
-   **`effects.ts`**: Imperative boundary. Git CLI, filesystem, process lifecycle.
-   **`presenter.ts`**: View-model factory. **No logic in JSX.**
-   **`facade.ts`**: The single SDK-like entry point.

## Consumer DX Example

```ts
import { rebase } from "@/features/rebase/facade";

const draft = rebase.startFromSelection({ commits, selectedIndex });
const planned = rebase.confirmScope(draft);
const validated = rebase.validate(planned);

if (rebase.canBegin(validated)) {
  await rebase.begin(validated);
}
```

## Module Specifics

### Log (The Foundation)
- All commit-based UIs must use `features/log/projection.ts` for consistency.
- Projections: `focus`, `review`, `surgery`, `graph`.

### Rebase
- **Stages**: `idle` -> `scope` -> `plan` -> `runtime`.
- **UI**: Only three screens: **Scope**, **Plan**, **Runtime**.
- **Actions**: Isolated in `src/features/rebase/actions/`.

## Implementation Order

1.  **Rebase**: Complete end-to-end first (model, engine, effects, facade, UI).
2.  **Cherry-pick**: Batch-first UX and architecture extraction.
3.  **Log**: Unified projection and custom modes.
4.  **Submodule**: Health dashboard and engine.
5.  **Branch Freshness**: Intelligence and HUD integration.
6.  **Remote Awareness**: CI/Webhook enrichment.

---

## Meaningful Customization (Detailed)

Keep native primitives (`Map`, `Set`, `AbortController`). Add wrappers only for repeated semantics:
- `ProcessSupervisor`: Centralized cleanup and cancellation.
- `SelectionMgr`: Unified selection logic for commits/files.
- `OutputBuffer`: Managed streaming for Git output.

Avoid generic abstractions that don't add domain value.
