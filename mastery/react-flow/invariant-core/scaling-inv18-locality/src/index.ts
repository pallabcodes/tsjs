/**
 * SCALING-INV-18: Mechanical Sympathy (Flat Buffers)
 * 
 * High-performance spatial store using contiguous memory.
 */

export class FlatNodeStore {
  // Storing [x, y, w, h] per node. 
  // 4 numbers * 8 bytes (Float64) = 32 bytes per node.
  private buffer: Float64Array;
  private idToIndex: Map<string, number> = new Map();
  private indexToId: string[] = [];

  constructor(maxNodes: number) {
    this.buffer = new Float64Array(maxNodes * 4);
  }

  addNode(id: string, x: number, y: number, w: number, h: number) {
    const index = this.indexToId.length;
    this.idToIndex.set(id, index);
    this.indexToId.push(id);
    
    const offset = index * 4;
    this.buffer[offset] = x;
    this.buffer[offset + 1] = y;
    this.buffer[offset + 2] = w;
    this.buffer[offset + 3] = h;
  }

  updatePosition(id: string, x: number, y: number) {
    const index = this.idToIndex.get(id);
    if (index === undefined) return;
    
    const offset = index * 4;
    this.buffer[offset] = x;
    this.buffer[offset + 1] = y;
  }

  /**
   * The "Mechanical Sympathy" DNA.
   * Extremely fast iteration because data is contiguous in memory.
   */
  forEach(callback: (id: string, x: number, y: number, w: number, h: number) => void) {
    for (let i = 0; i < this.indexToId.length; i++) {
      const offset = i * 4;
      callback(
        this.indexToId[i],
        this.buffer[offset],
        this.buffer[offset + 1],
        this.buffer[offset + 2],
        this.buffer[offset + 3]
      );
    }
  }

  get count(): number {
    return this.indexToId.length;
  }
}
