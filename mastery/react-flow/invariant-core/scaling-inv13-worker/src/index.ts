import { Worker } from 'node:worker_threads';

/**
 * Scaling INV-13: Main Thread Bridge
 * 
 * Handles communication with the reconciliation worker.
 */

export class AsyncGraphEngine {
  private worker: Worker;
  private pendingResolve: ((value: any) => void) | null = null;

  constructor(workerPath: string) {
    this.worker = new Worker(workerPath);
    this.worker.on('message', (msg) => {
      if (msg.type === 'RECONCILED' && this.pendingResolve) {
        this.pendingResolve(msg.payload);
        this.pendingResolve = null;
      }
    });
  }

  /**
   * The "Async Reconciliation" DNA.
   * Offloads the $O(N)$ work and returns a promise.
   */
  async reconcile(changes: any[], nodes: any[]): Promise<any[]> {
    return new Promise((resolve) => {
      this.pendingResolve = resolve;
      this.worker.postMessage({
        type: 'RECONCILE',
        payload: { changes, nodes }
      });
    });
  }

  terminate() {
    this.worker.terminate();
  }
}
