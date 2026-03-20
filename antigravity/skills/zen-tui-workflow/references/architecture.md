# Zen-TUI Architecture (L5 Reference)

## Feature-Engine Strategy

Every workflow is an isolated feature engine. Consumers must never reach past the `facade.ts`.

```ts
src/
  app/
    shell/       // App-level orchestration (nav, focus, theme)
    runtime/     // Resource & process management
  features/
    log/         // FOUNDATIONAL: Owns commit projection
    rebase/      // Rebase engine (consumes log projection)
    cherry-pick/ // Cherry-pick engine
    ...
  lib/           // Native/Shared meaningful wrappers
  components/    // Thin Ink wrappers around presenters
```

## The Layer Contract (Zero-Crossover Rule)

-   **`model.ts`**: Total domain ownership. State machine states, exhaustive types, zero `any`.
-   **`engine.ts`**: Pure mathematical transitions. Zero side effects. Zero dependency on Ink/React.
-   **`effects.ts`**: Imperative boundary. Git CLI, filesystem, process lifecycle, `AbortController`.
-   **`presenter.ts`**: View-model factory. Transforms domain state into TUI-ready structures. **No logic in JSX.**
-   **`facade.ts`**: The SDK Surface. Hides all implementation details.

## Finesse Standards

1.  **Type Integrity**: Use module augmentation and `.d.ts` for third-party libs. Total coverage is required.
2.  **Performance**: Optimize FFI/NAPI boundaries. Use a central `ProcessSupervisor` for cleanup.
3.  **Visual DX**: One screen = one clear purpose. No clutter. Premium animations (via Ink/Solid transitions).
4.  **Log-First**: All commit-based UIs must use the `features/log/projection.ts` for data consistency.

Read [meaningful-customization.md](meaningful-customization.md) for how to correctly extend the system.
