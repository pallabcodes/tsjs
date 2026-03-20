# Rebase Feature Workspace

`rebase` owns all history-rewrite behavior.

Current layers:

- `model.ts`
  Domain types, states, invariants.
- `engine.ts`
  Pure state transitions.
- `effects.ts`
  External git/editor/process boundary.
- `selectors.ts`
  Stable high-level reads for consumers.
- `presenter.ts`
  Domain state to TUI-ready view models.
- `facade.ts`
  Public SDK-like consumer surface.

Workspace rules:

- UI components should consume `facade`, `selectors`, and `presenter`, not raw engine internals.
- `engine.ts` must stay free of Ink, subprocess, and file-writing logic.
- `effects.ts` is where actual `git rebase` command execution belongs.
- Action-specific logic should live under `actions/` when it stops being trivial shared plan/runtime logic.

`actions/` is intentionally created up front so `pick`, `reword`, `edit`, `squash`, `fixup`, and `drop` can grow in place without turning the feature root into a junk drawer.

Do not add a new layer unless it gives one of these:

- a clearer public API
- a cleaner effect boundary
- better test isolation
- easier debugging of one rebase concern without touching unrelated ones
