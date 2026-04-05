/**
 * @zen-tui/core/engine: Sovereign Reconciler (Force-Bake Protocol)
 */
import { type ZenNode, type ZenEngine } from '@zen-tui/node';
import { computeLayout } from './layout';
import { syncNativeNode } from './compositor';

/**
 * reconcile: Deep DFS Traversal for bitwise re-baking.
 * This ensures that even if Solid.js state is stable, the binary atoms
 * are projected into the freshly cleared frame-buffer during every tick.
 */
export function reconcile(node: ZenNode, engine: ZenEngine) {
    if (!node) return;

    // 🧱 Step 1: Perform industrial reflow (layout) 
    // This ensures geometry perfectness before the bitwise bake.
    computeLayout(node, engine.painter.getWidth(), engine.painter.getHeight());

    // 🧱 Step 2: DFS Paint
    const paintNode = (n: ZenNode) => {
        // Trigger the bitwise compositor logic for this node
        syncNativeNode(n);

        // Project children with industrial precision
        if (n.children) {
            for (const child of n.children) {
                if (child) paintNode(child);
            }
        }
    };

    paintNode(node);
}
