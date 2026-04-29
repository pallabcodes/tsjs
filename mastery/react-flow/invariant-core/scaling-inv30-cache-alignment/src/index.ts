/**
 * SCALING-INV-30: Cache Line Alignment
 * 
 * Ensures node records are aligned to 64-byte boundaries to avoid False Sharing.
 */

export class CacheAlignedStore {
  // A standard Float64 is 8 bytes. 
  // 64 bytes / 8 bytes = 8 elements.
  // Each node will own a "Block" of 8 Float64s, even if it only uses 4.
  private buffer: Float64Array;
  private stride: number = 8; 

  constructor(maxNodes: number) {
    this.buffer = new Float64Array(maxNodes * this.stride);
  }

  /**
   * The "Mechanical Sympathy" DNA.
   * Updates a node while ensuring no other thread's cache line is invalidated.
   */
  updatePosition(index: number, x: number, y: number) {
    const offset = index * this.stride;
    this.buffer[offset] = x;
    this.buffer[offset + 1] = y;
    // Indices offset+2 to offset+7 are "Padding" (Dead Space)
  }

  getPosition(index: number): { x: number, y: number } {
    const offset = index * this.stride;
    return {
      x: this.buffer[offset],
      y: this.buffer[offset + 1]
    };
  }
}
