/**
 * SCALING-INV-16: Reactive Batching & Throttling
 * 
 * Synchronizes multiple updates into a single "Flush" per frame.
 */

export interface Change {
  id: string;
  type: string;
  [key: string]: any;
}

export class ChangeBatcher {
  private queue: Map<string, Change> = new Map();
  private isFlushing: boolean = false;

  /**
   * Adds a change to the buffer. 
   * If a change for the same ID already exists, it is OVERWRITTEN (Deduplication).
   */
  add(change: Change) {
    // Deduplication logic: If a node moved twice in one frame, 
    // only the latest position matters.
    const key = `${change.id}-${change.type}`;
    this.queue.set(key, change);
  }

  /**
   * Flushes the buffer. 
   * In a browser, this would be called inside requestAnimationFrame.
   */
  flush(): Change[] {
    const batchedChanges = Array.from(this.queue.values());
    this.queue.clear();
    return batchedChanges;
  }

  /**
   * Browser-integrated DNA (Simulation for Node/Test environment)
   */
  async requestFlush(): Promise<Change[]> {
    return new Promise((resolve) => {
      // In browser: requestAnimationFrame(() => resolve(this.flush()))
      // In Node: setImmediate simulates the next tick
      setTimeout(() => {
        resolve(this.flush());
      }, 0);
    });
  }

  get pendingCount(): number {
    return this.queue.size;
  }
}
