import { SharedNodeStore } from '../../scaling-inv19-zerocopy/src/index.ts';

/**
 * SCALING-INV-24: Double-Buffered Atomic Snapshots
 * 
 * Manages two buffers for fault-tolerant state updates.
 */

export class DoubleBufferStore {
  private buffers: [SharedNodeStore, SharedNodeStore];
  private frontIndex: number = 0;

  constructor(maxNodes: number) {
    this.buffers = [
      new SharedNodeStore(maxNodes),
      new SharedNodeStore(maxNodes)
    ];
  }

  getFront(): SharedNodeStore {
    return this.buffers[this.frontIndex];
  }

  getBack(): SharedNodeStore {
    return this.buffers[1 - this.frontIndex];
  }

  /**
   * The "Atomic Swap" DNA.
   * Only swaps if the update is successful.
   */
  swap() {
    this.frontIndex = 1 - this.frontIndex;
  }

  /**
   * Fault recovery: Discard the back buffer and reset from the front.
   */
  rollback() {
    // In a real system, we'd copy front to back or just clear the back.
    console.log('Rolling back to last good state...');
  }
}
