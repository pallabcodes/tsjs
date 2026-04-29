/**
 * SCALING-INV-14: Spatial Indexing (QuadTree)
 * 
 * Elevates spatial queries from O(N) to O(log N).
 * This "Production-Grade" version handles Rectangles and dynamic updates.
 */

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SpatialNode extends Rect {
  id: string;
}

export class QuadTree {
  private nodes: SpatialNode[] = [];
  private children: QuadTree[] = [];
  private capacity: number = 4;
  private divided: boolean = false;

  constructor(private boundary: Rect) {}

  private subdivide() {
    const { x, y, width, height } = this.boundary;
    const w = width / 2;
    const h = height / 2;

    this.children = [
      new QuadTree({ x: x, y: y, width: w, height: h }), // NW
      new QuadTree({ x: x + w, y: y, width: w, height: h }), // NE
      new QuadTree({ x: x, y: y + h, width: w, height: h }), // SW
      new QuadTree({ x: x + w, y: y + h, width: w, height: h }) // SE
    ];
    this.divided = true;
  }

  insert(node: SpatialNode): boolean {
    // If the node doesn't overlap the boundary at all, reject it
    if (!this.intersects(this.boundary, node)) {
      return false;
    }

    // If we haven't divided and have space, or if the node is too big to fit in any child, store it here
    if (!this.divided) {
      if (this.nodes.length < this.capacity) {
        this.nodes.push(node);
        return true;
      }
      this.subdivide();
      
      // Redistribute existing nodes
      const oldNodes = this.nodes;
      this.nodes = [];
      for (const n of oldNodes) {
        this.insert(n);
      }
    }

    // Attempt to insert into children
    // A node is inserted into a child ONLY if it fits COMPLETELY inside it
    for (const child of this.children) {
      if (this.containsRect(child.boundary, node)) {
        return child.insert(node);
      }
    }

    // If it doesn't fit completely in any child (i.e. it spans across quadrants),
    // store it in this parent node.
    this.nodes.push(node);
    return true;
  }

  query(range: Rect, found: SpatialNode[] = []): SpatialNode[] {
    if (!this.intersects(this.boundary, range)) {
      return found;
    }

    // Check nodes stored in this level
    for (const node of this.nodes) {
      if (this.intersects(node, range)) {
        found.push(node);
      }
    }

    // Recursively check children
    if (this.divided) {
      for (const child of this.children) {
        child.query(range, found);
      }
    }

    return found;
  }

  remove(id: string): boolean {
    const index = this.nodes.findIndex(n => n.id === id);
    if (index !== -1) {
      this.nodes.splice(index, 1);
      return true;
    }

    if (this.divided) {
      for (const child of this.children) {
        if (child.remove(id)) return true;
      }
    }

    return false;
  }

  clear() {
    this.nodes = [];
    this.children = [];
    this.divided = false;
  }

  /**
   * Helper: Check if rect A contains rect B completely
   */
  private containsRect(a: Rect, b: Rect): boolean {
    return (
      b.x >= a.x &&
      b.x + b.width <= a.x + a.width &&
      b.y >= a.y &&
      b.y + b.height <= a.y + a.height
    );
  }

  /**
   * Helper: Check if two rects intersect (AABB)
   */
  private intersects(a: Rect, b: Rect): boolean {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }
}
