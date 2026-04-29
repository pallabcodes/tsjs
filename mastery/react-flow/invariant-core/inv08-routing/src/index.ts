import { Point } from '../../inv02-viewport/src/index.ts';
import { HandleType } from '../../inv04-handle/src/index.ts';

/**
 * Invariant 08: Path Routing (Tiny Model)
 * 
 * This implementation captures the essence of xyflow's edge paths:
 * 1. Cubic Bézier math.
 * 2. Handle-direction-aware control point placement.
 */

export type Position = 'top' | 'bottom' | 'left' | 'right';

/**
 * The "Control Point" DNA.
 * Projects a point outward from a handle based on its direction.
 */
function getControlPoint(
  point: Point,
  pos: Position,
  distance: number
): Point {
  switch (pos) {
    case 'left': return { x: point.x - distance, y: point.y };
    case 'right': return { x: point.x + distance, y: point.y };
    case 'top': return { x: point.x, y: point.y - distance };
    case 'bottom': return { x: point.x, y: point.y + distance };
  }
}

/**
 * The "Bezier Path" DNA.
 * Calculates the SVG path string for a smooth curve.
 */
export function getBezierPath(
  source: Point,
  sourcePos: Position,
  target: Point,
  targetPos: Position,
  curvature: number = 0.25
): string {
  // Calculate distance-based offset for control points
  const dx = Math.abs(target.x - source.x);
  const dy = Math.abs(target.y - source.y);
  const offset = Math.max(dx, dy) * curvature;

  const c1 = getControlPoint(source, sourcePos, offset);
  const c2 = getControlPoint(target, targetPos, offset);

  return `M ${source.x},${source.y} C ${c1.x},${c1.y} ${c2.x},${c2.y} ${target.x},${target.y}`;
}

/**
 * Calculates a simple mid-point for labels.
 */
export function getPathCenter(source: Point, target: Point): Point {
  return {
    x: (source.x + target.x) / 2,
    y: (source.y + target.y) / 2
  };
}
