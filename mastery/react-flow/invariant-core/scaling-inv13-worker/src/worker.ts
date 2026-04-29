import { parentPort } from 'node:worker_threads';
import { applyNodeChanges } from '../../inv01-model/src/index.ts';

/**
 * Scaling Invariant 13: Background Reconciliation (Worker DNA)
 * 
 * This worker mirrors the logic of INV-01 but operates on its own
 * memory heap, preventing Main Thread blocking.
 */

if (parentPort) {
  parentPort.on('message', ({ type, payload }) => {
    if (type === 'RECONCILE') {
      const { changes, nodes } = payload;
      
      // Perform the heavy reconciliation
      const updatedNodes = applyNodeChanges(changes, nodes);
      
      // Send back the result
      parentPort?.postMessage({
        type: 'RECONCILED',
        payload: updatedNodes
      });
    }
  });
}
