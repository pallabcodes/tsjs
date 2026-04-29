/**
 * SCALING-INV-27: Collaborative DNA (CRDTs)
 * 
 * Conflict-free Replicated Data Types for multi-user scaling.
 */

export interface Update {
  nodeId: string;
  value: any;
  timestamp: number;
  userId: string;
}

export class LWWRegister {
  private state: Map<string, { value: any, timestamp: number, userId: string }> = new Map();

  /**
   * The "Commutative Merge" DNA.
   * Merges an update using the Last-Writer-Wins (LWW) strategy.
   * This is guaranteed to be consistent across all users.
   */
  merge(update: Update) {
    const current = this.state.get(update.nodeId);
    
    if (!current || update.timestamp > current.timestamp) {
      this.state.set(update.nodeId, {
        value: update.value,
        timestamp: update.timestamp,
        userId: update.userId
      });
    } else if (update.timestamp === current.timestamp) {
      // Tie-break using User ID
      if (update.userId > current.userId) {
        this.state.set(update.nodeId, {
          value: update.value,
          timestamp: update.timestamp,
          userId: update.userId
        });
      }
    }
  }

  getValue(nodeId: string) {
    return this.state.get(nodeId)?.value;
  }
}
