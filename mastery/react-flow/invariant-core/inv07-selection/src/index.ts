import { Point } from '../../inv02-viewport/src/index.ts';

/**
 * Invariant 07: Interaction Plane (Tiny Model)
 * 
 * This implementation captures the essence of xyflow's multi-selection:
 * 1. AABB Intersection (Finding nodes in a rect)
 * 2. Selection Box logic (Start/End points)
 */

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SelectableNode extends Point {
  id: string;
  width: number;
  height: number;
}

/**
 * The "Intersection" DNA.
 * Checks if two rectangles overlap (AABB).
 */
export function isIntersecting(rectA: Rect, rectB: Rect): boolean {
  return (
    rectA.x < rectB.x + rectB.width &&
    rectA.x + rectA.width > rectB.x &&
    rectA.y < rectB.y + rectB.height &&
    rectA.y + rectA.height > rectB.y
  );
}

/**
 * The "Selection Engine" DNA.
 * Converts a start/end drag point into a normalized Rect.
 */
export function calculateSelectionRect(start: Point, end: Point): Rect {
  return {
    x: Math.min(start.x, end.x),
    y: Math.min(start.y, end.y),
    width: Math.abs(end.x - start.x),
    height: Math.abs(end.y - start.y),
  };
}

/**
 * Finds all nodes within the selection area.
 */
export function getNodesInSelection(
  selectionRect: Rect,
  nodes: SelectableNode[]
): string[] {
  const selectedIds: string[] = [];
  
  for (const node of nodes) {
    const nodeRect: Rect = {
      x: node.x,
      y: node.y,
      width: node.width,
      height: node.height
    };

    if (isIntersecting(selectionRect, nodeRect)) {
      selectedIds.push(node.id);
    }
  }

  return selectedIds;
}
