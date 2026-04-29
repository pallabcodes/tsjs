/**
 * SCALING-INV-17: Incremental Dependency Tracking
 * 
 * Tracks O(1) relationships to avoid O(N) searches during updates.
 */

export class DependencyManager {
  // Mapping: nodeId -> Set of Edge IDs
  private nodeToEdges: Map<string, Set<string>> = new Map();
  // Mapping: parentId -> Set of Child Node IDs
  private parentToChildren: Map<string, Set<string>> = new Map();

  /**
   * Registers a relationship.
   */
  registerEdge(edgeId: string, sourceId: string, targetId: string) {
    this.addRelation(this.nodeToEdges, sourceId, edgeId);
    this.addRelation(this.nodeToEdges, targetId, edgeId);
  }

  registerParent(childId: string, parentId: string) {
    this.addRelation(this.parentToChildren, parentId, childId);
  }

  /**
   * The O(1) Impact Analysis.
   * Returns exactly what needs to be re-evaluated when a node moves.
   */
  getAffectedElements(nodeId: string): { edges: string[], children: string[] } {
    return {
      edges: Array.from(this.nodeToEdges.get(nodeId) || []),
      children: Array.from(this.parentToChildren.get(nodeId) || [])
    };
  }

  private addRelation(map: Map<string, Set<string>>, key: string, val: string) {
    if (!map.has(key)) map.set(key, new Set());
    map.get(key)!.add(val);
  }

  clear() {
    this.nodeToEdges.clear();
    this.parentToChildren.clear();
  }
}
