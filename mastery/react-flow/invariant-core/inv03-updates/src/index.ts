import { Node, NodeChange, applyNodeChanges } from '../../inv01-model/src';

/**
 * Invariant 03: Reactive Updates (Tiny Model)
 * 
 * This implementation captures the essence of xyflow's update orchestration:
 * 1. Change Collection (Batching)
 * 2. Middleware Pattern (Intercepting changes)
 * 3. State Synchronization Loop
 */

export type Middleware = (changes: NodeChange[]) => NodeChange[];
export type OnChange = (changes: NodeChange[]) => void;

export class ReactiveEngine {
  private nodes: Node[];
  private middlewares: Middleware[] = [];
  private onNodesChange?: OnChange;

  constructor(initialNodes: Node[], onNodesChange?: OnChange) {
    this.nodes = initialNodes;
    this.onNodesChange = onNodesChange;
  }

  addMiddleware(mw: Middleware) {
    this.middlewares.push(mw);
  }

  /**
   * The "Happy Path" for a state update.
   * Mirrors xyflow's triggerNodeChanges logic.
   */
  triggerChanges(rawChanges: NodeChange[]) {
    if (rawChanges.length === 0) return;

    // 1. Apply Middlewares (Invariant: Interception)
    let changes = rawChanges;
    for (const mw of this.middlewares) {
      changes = mw(changes);
    }

    // 2. Reconcile internal state (Invariant: Self-consistency)
    // Using INV-01 DNA here.
    this.nodes = applyNodeChanges(changes, this.nodes);

    // 3. Notify external listeners (Invariant: Reactive Propagation)
    if (this.onNodesChange) {
      this.onNodesChange(changes);
    }
  }

  /**
   * Helper to simulate a drag event.
   */
  simulateNodeDrag(id: string, deltaX: number, deltaY: number) {
    const node = this.nodes.find(n => n.id === id);
    if (!node) return;

    const change: NodeChange = {
      id,
      type: 'position',
      position: {
        x: node.position.x + deltaX,
        y: node.position.y + deltaY
      }
    };

    this.triggerChanges([change]);
  }

  getNodes() {
    return this.nodes;
  }
}
