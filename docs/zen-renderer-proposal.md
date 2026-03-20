# Proposal: The Zen-Renderer (Solid-TUI Engine)

## The Problem with Ink (React-based)
While Ink is excellent for quick CLI tools, it carries the **VDOM overhead** of React. For a high-performance Git TUI (Zen-TUI) where we need to render complex, real-time commit graphs and stream thousands of lines:
1.  **Reconciliation Lag**: The VDOM diffing process is unnecessary work for terminal outputs which are naturally data-driven.
2.  **JSX Conflict**: Mixing Solid-js (logic) and React (Ink) creates the "Namespace Collision" we just fought. It's an architectural "mashup" rather than a unified design.
3.  **Layout Constraints**: Ink's Flexbox engine is great but can be restrictive when we need pixel-perfect (character-perfect) terminal control for "Lanes" and "Mutation Previews."

## The "Zen" Solution: A Bespoke Solid-js Renderer
Instead of building *on top* of Ink, we build a **custom Solid-js TUI Driver**.

### 🏗️ Architecture
-   **Signals (Solid)**: Every piece of the TUI is a Signal. `drift()`, `rows()`, `selectedIndex()`.
-   **Immediate-Mode Renderer (Rust)**: A Rust core (`log.concept.rs`) that maintains a **Virtual Terminal Buffer**.
-   **The Bridge**: Solid-js signals trigger **Partial Updates** to the Rust buffer directly. No VDOM diffing.
    -   *Logic*: Solid-js.
    -   *Painting*: Rust (via N-API).
    -   *Layout*: A custom "Constraint Engine" optimized for the 2D character grid.

### 🚀 USPs of the Zen-Renderer
1.  **Sub-millisecond Feedback**: Zero VDOM overhead means input-to-render lag is practically decoupled from CPU load.
2.  **Infinite Graph Scrolling**: By controlling the buffer directly in Rust, we can stream the commit graph without holding the whole tree in JS memory.
3.  **Frame-Perfect Animations**: Real-time "hud-glow" and "mutation transitions" that feel fluid even in the terminal.

## "Taste" Proof of Concept (The Renderer Loop)
```rust
// rust/renderer.rs (Concept)
pub struct ZenBuffer {
    grid: Vec<Vec<Cell>>,
}

impl ZenBuffer {
    pub fn partial_update(&mut self, change: TerminalMutation) {
        // Direct buffer manipulation - no diffing
        self.apply(change);
        self.flush_to_stdout();
    }
}
```

```typescript
// ts/renderer.ts (Concept)
import { createRenderEffect } from "solid-js";

export const createZenComponent = (renderer: RustRenderer) => {
    createRenderEffect(() => {
        // This effect runs ONLY when the specific signal changes
        // It pushes the minimal delta to Rust
        renderer.pushMutation({
            x: 10, y: 2, 
            content: `FRESHNESS: ${state.drift}`,
            color: state.drift > 0 ? "amber" : "green"
        });
    });
};
```

---
> [!IMPORTANT]
> This is a high-risk, high-reward move. It requires building the "DOM" in the TUI, but for a Google-level L5 product, this is the **truly correct** way to achieve the intended "Finesse."
