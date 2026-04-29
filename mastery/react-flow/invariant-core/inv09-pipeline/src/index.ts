import { Rect, isIntersecting, SelectableNode } from '../../inv07-selection/src/index.ts';

/**
 * Invariant 09: Rendering Pipeline (Tiny Model)
 * 
 * This implementation captures the performance DNA:
 * 1. Spatial Pruning (Virtualization).
 * 2. Z-Index Elevation.
 */

export interface RenderableNode extends SelectableNode {
  zIndex?: number;
  selected?: boolean;
  hidden?: boolean;
}

/**
 * The "Virtualization" DNA.
 * Returns only the nodes that intersect the viewport.
 */
export function getVisibleNodes(
  viewport: Rect,
  nodes: RenderableNode[]
): RenderableNode[] {
  return nodes.filter(node => {
    if (node.hidden) return false;
    
    const nodeRect: Rect = {
      x: node.x,
      y: node.y,
      width: node.width,
      height: node.height
    };

    return isIntersecting(viewport, nodeRect);
  });
}

/**
 * The "Elevation" DNA.
 * Calculates stacking order based on selection state.
 */
const SELECTED_Z_BOOST = 1000;

export function calculateZIndex(node: RenderableNode): number {
  const baseZ = node.zIndex ?? 0;
  return node.selected ? baseZ + SELECTED_Z_BOOST : baseZ;
}

/**
 * The "Batch Rendering" DNA.
 * Sorts nodes by Z-Index before rendering to ensure correct DOM order
 * (though CSS z-index also handles this, DOM order is important for accessibility).
 */
export function sortNodesByZ(nodes: RenderableNode[]): RenderableNode[] {
  return [...nodes].sort((a, b) => calculateZIndex(a) - calculateZIndex(b));
}
