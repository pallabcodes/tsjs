/**
 * SCALING-INV-26: Bit-Packed Spatial Hashing
 * 
 * O(1) spatial lookup using a flat integer grid.
 */

export class SpatialHash {
  private grid: Map<number, string[]> = new Map();
  private cellSize: number = 100;

  /**
   * The "Bit-Packing" DNA.
   * Compresses (x, y) into a single uint32 key.
   */
  private getKey(x: number, y: number): number {
    const gx = Math.floor(x / this.cellSize);
    const gy = Math.floor(y / this.cellSize);
    return (gx << 16) | gy;
  }

  insert(id: string, x: number, y: number) {
    const key = this.getKey(x, y);
    if (!this.grid.has(key)) this.grid.set(key, []);
    this.grid.get(key)!.push(id);
  }

  /**
   * The "Zero-Tree" DNA.
   * Finds nodes in O(1) time per cell without tree traversal.
   */
  queryPoint(x: number, y: number): string[] {
    const key = this.getKey(x, y);
    return this.grid.get(key) || [];
  }

  clear() {
    this.grid.clear();
  }
}
