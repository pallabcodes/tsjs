# Meaningful Customization (L5 Guide)

In `zen-tui`, customization is not just "adding code"—it's about improving the "caliber" and "finesse" of the product.

## When to Customize

Ask: "Does this change improve DX, Performance, or Type Safety in a way that standard libraries cannot?"

### ✅ DO Customize (Meaningful)

1.  **FFI/NAPI Optimization**: If a binding's signature is awkward or slow, wrap/modify it to be perfect for our feature engines.
2.  **Semantic Wrappers**: If you find yourself manually managing a "Set of selected commit hashes" in three places, create a `SelectionMgr` in `lib/` or the feature's `model.ts`.
3.  **Presenter Adapters**: If an Ink component needs a `if` statement to decide a color or layout, move that logic into a `presenter.ts` adapter. Result: `<Status color={p.statusColor} />`.
4.  **Module Augmentation**: If a library (like Ink) has missing types for a specific ANSI trick, add them in a local `.d.ts`.

### ❌ DO NOT Customize (Clutter)

1.  **Generic Collection Wrappers**: Don't wrap `Map` or `Set` unless you're adding domain-specific logic (e.g., an LRU cache for diffs).
2.  **Deep Component Nesting**: Don't create five layers of "Layout" components if one `Layout` with proper props suffices.
3.  **Hiding Git Complexity**: Don't hide important Git errors behind generic "Error" strings. The DX must be transparent to the user.

## Type Safety Finesse

- **No `any`**: If a type is unknown (e.g., from a CLI JSON output), define an interface or use a validator (like Zod) at the boundary.
- **Exhaustive Enums/Unions**: Always use union types for state (e.g., `RebaseStage`) to ensure the compiler catches unhandled cases.
- **Narrowing**: Use type guards to keep the code path clear.

## Example: The Process Supervisor

Instead of calling `child_process.spawn` directly in `effects.ts`, we use a `ProcessSupervisor` wrapper.
- **Reason**: It centralizes the lifecycle, ensures `AbortController` is respected, and handles cleanup on app exit.
- **Value**: Reliability and Performance.
