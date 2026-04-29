import { QuadTree, SpatialNode, Rect } from '../../scaling-inv14-spatial/src/index.ts';

/**
 * SCALING-INV-15: Spatial Virtualization
 * 
 * High-performance render list generation using QuadTrees.
 */

export class SpatialVirtualizer {
  private quadTree: QuadTree;

  constructor(boundary: Rect) {
    this.quadTree = new QuadTree(boundary);
  }

  /**
   * Syncs the virtualizer with the current state of nodes.
   * In a production engine, this would be reactive/incremental.
   */
  updateNodes(nodes: SpatialNode[]) {
    this.quadTree.clear();
    for (const node of nodes) {
      this.quadTree.insert(node);
    }
  }

  /**
   * The O(log N) Render List DNA.
   * Returns only nodes that intersect the viewport.
   */
  getVisibleNodes(viewport: Rect): SpatialNode[] {
    return this.quadTree.query(viewport);
  }

  /**
   * Benchmark helper to show the difference between O(N) and O(log N)
   */
  static getLinearVisibleNodes(viewport: Rect, nodes: SpatialNode[]): SpatialNode[] {
    return nodes.filter(node => {
      return (
        viewport.x < node.x + node.width &&
        viewport.x + viewport.width > node.x &&
        viewport.y < node.y + node.height &&
        viewport.y + viewport.height > node.y
      );
    });
  }
}
