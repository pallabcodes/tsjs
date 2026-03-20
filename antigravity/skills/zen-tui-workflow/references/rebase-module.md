# Rebase Module (L5 Reference)

## Architecture & Dependency

The Rebase module is a state-machine-driven feature engine. It **must** consume the Log projection for its UI.

```ts
src/features/rebase/
  model.ts      // Exhaustive RebaseState and RebaseStage unions.
  engine.ts     // Pure transitions. Single-commit vs Multi-commit logic.
  effects.ts    // Git subprocess management & AbortController.
  selectors.ts  // Memoized reads for plan/runtime state.
  presenter.ts  // Shapes the Scope, Plan, and Runtime screens.
  facade.ts     // The only public SDK for rebase.
  actions/      // Individual action logic (pick, squash, etc.)
```

## Action Implementation Finesse

When implementating or refactoring actions in `src/features/rebase/actions/`:
- **Isolation**: Each action must own its specific validation and transition logic.
- **Types**: Use specific interfaces for action data (e.g., `SquashActionData`).
- **No Side Effects**: Keep action logic inside the `engine.ts` or dedicated pure files.

## Rebase UI & UX (Premium Standard)

1.  **Scope Screen**: Use `features/log/projection.ts` to render the commit selection. Ensure the range is visually obvious.
2.  **Plan Screen**: 
    - The plan table must be compact. 
    - Use `presenter.ts` to decide row colors and action labels.
    - Drag-and-drop or hotkey-based reordering must be smooth.
3.  **Runtime Screen**: 
    - One "Strong Stop Card" per stop reason (Conflict, Reword, etc.).
    - Clear, high-visibility "Next Actions" (Continue, Skip, Abort).

## Runtime Safety

- **Abort Recovery**: Every rebase start must record a `RebaseRecoveryTarget` (usually the original HEAD) in the `model.ts`. 
- **Atomic Operations**: Ensure `effects.ts` handles the `git rebase` lifecycle atomically, including the writing of todo/message files.
