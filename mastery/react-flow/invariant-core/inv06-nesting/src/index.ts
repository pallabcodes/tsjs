import { XYPosition, Node } from '../../inv01-model/src/index.ts';

/**
 * Invariant 06: Nesting & Layout (Tiny Model)
 * 
 * This implementation captures the essence of xyflow's sub-flow logic:
 * 1. Recursive Absolute Position calculation.
 * 2. Parent Expansion with relative offset compensation.
 */

export interface NestedNode extends Node {
  parentId?: string;
  expandParent?: boolean;
  width: number;
  height: number;
  absolutePosition: XYPosition;
}

/**
 * Calculates absolute position by traversing up the parent chain.
 * Invariant: Absolute = ParentAbsolute + Relative
 */
export function calculateAbsolutePosition(
  nodeId: string,
  nodeLookup: Map<string, NestedNode>
): XYPosition {
  const node = nodeLookup.get(nodeId);
  if (!node) return { x: 0, y: 0 };

  if (!node.parentId) {
    return node.position;
  }

  const parentPosition = calculateAbsolutePosition(node.parentId, nodeLookup);
  return {
    x: parentPosition.x + node.position.x,
    y: parentPosition.y + node.position.y,
  };
}

/**
 * Expands a parent to fit a child and compensates relative offsets.
 * The "Compensation Invariant" ensures that children don't move visually
 * when a parent's top-left corner shifts.
 */
export function expandParent(
  parentId: string,
  childId: string,
  nodeLookup: Map<string, NestedNode>
): void {
  const parent = nodeLookup.get(parentId);
  const child = nodeLookup.get(childId);
  if (!parent || !child) return;

  // 1. Calculate expansion needed in relative terms
  const xOverlap = Math.min(0, child.position.x);
  const yOverlap = Math.min(0, child.position.y);

  if (xOverlap < 0 || yOverlap < 0) {
    const xShift = Math.abs(xOverlap);
    const yShift = Math.abs(yOverlap);

    // 2. Move parent's top-left in absolute space
    parent.position.x -= xShift;
    parent.position.y -= yShift;
    
    // 3. Grow parent dimensions
    parent.width += xShift;
    parent.height += yShift;

    // 4. COMPENSATE: Move ALL children in the opposite direction
    // so they stay at the same absolute position.
    for (const node of nodeLookup.values()) {
      if (node.parentId === parentId) {
        node.position.x += xShift;
        node.position.y += yShift;
      }
    }
  }

  // 5. Grow parent if child extends past right/bottom
  const rightOverlap = child.position.x + child.width;
  const bottomOverlap = child.position.y + child.height;

  parent.width = Math.max(parent.width, rightOverlap);
  parent.height = Math.max(parent.height, bottomOverlap);
}
