import { Rect } from '../../scaling-inv14-spatial/src/index.ts';

/**
 * SCALING-INV-20: Incremental Edge Culling (Spatial Edges)
 * 
 * Logic for treating edges as spatial objects for O(log E) rendering.
 */

export interface Edge {
  id: string;
  sourceId: string;
  targetId: string;
}

export interface SpatialEdge extends Rect {
  id: string;
}

export function calculateEdgeAABB(
  source: { x: number, y: number, width: number, height: number },
  target: { x: number, y: number, width: number, height: number }
): Rect {
  const x1 = Math.min(source.x, target.x);
  const y1 = Math.min(source.y, target.y);
  const x2 = Math.max(source.x + source.width, target.x + target.width);
  const y2 = Math.max(source.y + source.height, target.y + target.height);

  return {
    x: x1,
    y: y1,
    width: x2 - x1,
    height: y2 - y1
  };
}
