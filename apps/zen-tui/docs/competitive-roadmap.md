# Zen-TUI Competitive Roadmap

## Purpose

Zen-TUI should not try to beat Lazygit by becoming a slightly different shortcut wrapper, and it should not try to beat OpenTUI by pretending to be a rendering framework first.

Zen-TUI should win on:

- workflow intelligence
- runtime discipline
- clearer recovery and debuggability
- purposeful terminal experience

This document turns that direction into an executable roadmap.

## Competitive Position

Current reality:

- Lazygit is ahead on breadth, maturity, and day-to-day Git workflow coverage.
- OpenTUI is ahead on native rendering/runtime maturity and terminal engine depth.
- Zen-TUI is now in a better place architecturally, but is still behind on real workflow completeness and native execution.

Current strengths:

- feature-first folder structure
- facade-first consumer DX
- clearer app-shell vs feature boundaries
- Rust native workspace shaped for future runtime ownership

Current gaps:

- rebase is not truly production-grade yet
- cherry-pick is incomplete
- log projection is still shallow
- native runtime is scaffolded but not truly driving the app
- branch freshness and submodule intelligence are not real yet

## Product Strategy

Zen-TUI should aim for:

1. parity where users expect it
2. superiority where the market is still clumsy
3. delight only after the core workflows are trustworthy

That means:

- first make history editing and recovery better than other Git TUIs
- then make history viewing and branch intelligence smarter
- then add ambient and experimental features without polluting the core

## Strategic Pillars

### 1. Workflow Intelligence

Zen-TUI should not just expose Git commands. It should help users choose and execute the right workflow.

Examples:

- branch freshness guidance
- rebase rehearsal and validation
- conflict-aware next steps
- recovery-first destructive actions
- upstream change awareness

### 2. Native Runtime Discipline

Rust should own the parts that benefit from stronger lifecycle control:

- process supervision
- output buffering
- resource scopes
- repository scanning
- commit graph construction
- diff parsing and caching
- workflow runtime orchestration

TypeScript should own:

- Ink view composition
- presenters
- keymaps and user intents
- app-shell orchestration

### 3. Intentional Terminal UX

Zen-TUI should feel more deliberate and more expressive than generic panel-heavy Git TUIs.

Goals:

- compact but rich layouts
- fewer filler lines
- operation-specific action footers
- better history projection than raw `git log --graph`
- ambient and delightful experiences only when they do not interfere with core work

## What We Must Win

These are the areas where Zen-TUI should aim to be better than market alternatives, not merely comparable.

### Rebase

Target:

- best-in-class TUI for interactive rebase

Requirements:

- explicit scope phase
- proper plan editor
- runtime stop states
- safe abort/continue/skip rules
- clear recovery target
- single-commit rewrite experience
- `--root` support
- conflict-aware runtime
- internal message editing

Ownership:

- TS: presenters, screens, keymaps
- Rust: runtime effects, process supervision, state snapshots later

### History Workspace

Target:

- a history view that is more useful than generic commit logs

Requirements:

- `focus`, `review`, `surgery`, `graph` modes
- better badges and row projection
- compact lane computation
- ancestry-aware context
- history editing integration

Ownership:

- TS: view rendering and mode switching
- Rust: graph building, projection, caching later

### Branch Freshness Intelligence

Target:

- proactive guidance instead of passive notifications

Requirements:

- ahead/behind visibility
- upstream delta summary
- overlap/risk hints
- surfaced in header, branches, and operation prompts

Ownership:

- TS: UI placement and prompts
- Rust: repository comparison and summary logic later

## Market Parity We Need

These are table-stakes features where being incomplete keeps Zen-TUI from being taken seriously.

### Cherry-Pick

- batch-first flow
- reorder support
- `--no-commit`
- conflict/runtime states
- explicit target context

### Submodule

- status summary
- dirty/uninitialized/detached states
- drift between recorded and checked-out SHA
- drill-down workflow

### Status and Diff

- better staging feedback
- smarter diff previews
- native parsing/caching later

### Core Git Process Reliability

- cancelable commands
- structured failures
- output capture
- temp resource cleanup

## Experimental Delight

These should stay isolated until the API and UX prove themselves.

### Music

- play
- pause
- stop
- current track summary
- optional visualizer later

### ASCII Ambience

- background modes like rain, waves, stars
- repo-state-reactive modes later
- never interfere with core readability

### Debug and Inspector Surfaces

- operation timeline
- process inspector
- buffer inspector
- event stream panel

## Native Roadmap

Rust should evolve in this order:

1. `runtime/process_supervisor`
2. `runtime/resource_scope`
3. `runtime/output_buffer`
4. `git/repository`
5. `features/log`
6. `features/rebase/effects`
7. `features/cherry_pick/effects`
8. `features/branch_freshness`
9. `features/submodule`
10. `features/experimental/*`

Rules:

- prefer coarse commands over chatty N-API calls
- use native events and snapshots instead of many tiny getters
- add shared buffers only when profiling shows real benefit
- do not introduce generic abstractions without domain value

## TS Roadmap

TypeScript should evolve in this order:

1. finish rebase scope/plan/runtime UX
2. harden log presenter and projection modes
3. add branch freshness surfaces
4. complete cherry-pick UX
5. integrate native services behind facades
6. add experimental surfaces only after core workflows feel trustworthy

Rules:

- UI consumes facades, selectors, and presenters
- app shell does not own workflow semantics
- views should not interpret raw Git/process state directly

## One Program Of Work, Not One Unsafe Pass

This entire roadmap is one integrated program, but it should be executed in phases that compound:

### Phase 1. Foundation

- architecture discipline
- native runtime wrappers
- rebase model/engine cleanup
- log projection shape

### Phase 2. Core Workflow Trust

- production-grade rebase UX and effects
- cherry-pick workflow completion
- status/diff reliability improvements

### Phase 3. Intelligence

- branch freshness engine
- smarter history workspace
- submodule intelligence

### Phase 4. Delight

- music
- ASCII ambience
- inspectors and ambient debug surfaces

## Success Criteria

Zen-TUI is on track when:

- rebase feels safer and clearer than other TUIs
- history views feel purpose-built instead of generic
- app code reads like consuming a small SDK
- Rust owns effect-heavy and performance-sensitive logic cleanly
- debugging an operation means looking at one feature module, not chasing flags across the app
- experimental features stay isolated and do not rot the core

## Immediate Next Pass

The next serious implementation pass should focus on:

1. native runtime wrappers becoming real
2. rebase effects becoming real
3. log projection becoming genuinely differentiated

That is the highest-leverage path to making Zen-TUI feel both smarter and snappier.
