/**
 * SCALING-INV-19: Zero-Copy Synchronization (SharedArrayBuffer)
 * 
 * Shared memory between threads for zero-latency updates.
 */

export class SharedNodeStore {
  // Float64Array view of the SharedArrayBuffer
  private buffer: Float64Array;
  private sharedBuffer: SharedArrayBuffer;

  constructor(maxNodes: number, existingBuffer?: SharedArrayBuffer) {
    const size = maxNodes * 4 * 8;
    if (existingBuffer) {
      this.sharedBuffer = existingBuffer;
    } else {
      // Fallback for browsers that block SharedArrayBuffer for security reasons
      if (typeof SharedArrayBuffer !== 'undefined') {
        this.sharedBuffer = new SharedArrayBuffer(size) as any;
      } else {
        console.warn('INV-19: SharedArrayBuffer not available. Falling back to standard ArrayBuffer (Zero-Copy disabled).');
        this.sharedBuffer = new ArrayBuffer(size) as any;
      }
    }
    this.buffer = new Float64Array(this.sharedBuffer as any);
  }

  getRawBuffer(): SharedArrayBuffer {
    return this.sharedBuffer;
  }

  /**
   * Zero-copy write.
   * Note: Atomics only work on Integer arrays. For Floats in a shared buffer,
   * we rely on the frame-based "Write -> Sync -> Read" cycle or bit-casting.
   */
  updatePosition(index: number, x: number, y: number) {
    const offset = index * 4;
    this.buffer[offset] = x;
    this.buffer[offset + 1] = y;
  }

  getPosition(index: number): { x: number, y: number } {
    const offset = index * 4;
    return {
      x: this.buffer[offset],
      y: this.buffer[offset + 1]
    };
  }
}
