/**
 * Invariant 01: Core Graph State Model (Tiny Model)
 * 
 * This implementation captures the essence of xyflow's reconciliation logic:
 * 1. Reference Stability (only copy changed objects)
 * 2. Change Stream (mutations as events)
 * 3. User vs System State (InternalNode)
 */

export interface XYPosition {
  x: number;
  y: number;
}

/** The user-provided node structure */
export interface Node {
  id: string;
  position: XYPosition;
  data: any;
  selected?: boolean;
}

/** The system-managed node structure with derived spatial state */
export interface InternalNode extends Node {
  internals: {
    absolutePosition: XYPosition;
    z: number;
  };
}

/** Change events (The "How" of mutations) */
export type NodeChange =
  | { id: string; type: 'position'; position?: XYPosition }
  | { id: string; type: 'select'; selected: boolean }
  | { id: string; type: 'remove' }
  | { item: Node; type: 'add' };

/**
 * The essence of xyflow's update logic.
 * Optimizes for React's reference-based re-rendering.
 */
export function applyNodeChanges(changes: NodeChange[], nodes: Node[]): Node[] {
  const updatedNodes: Node[] = [];
  const changesMap = new Map<string, NodeChange[]>();
  const nodesToAdd: Node[] = [];

  // 1. Batch changes by ID
  for (const change of changes) {
    if (change.type === 'add') {
      nodesToAdd.push(change.item);
    } else {
      const elementChanges = changesMap.get(change.id) || [];
      elementChanges.push(change);
      changesMap.set(change.id, elementChanges);
    }
  }

  // 2. Reconcile existing nodes
  for (const node of nodes) {
    const nodeChanges = changesMap.get(node.id);

    if (!nodeChanges) {
      updatedNodes.push(node); // Keep original reference (Invariant: Perf)
      continue;
    }

    if (nodeChanges.some((c) => c.type === 'remove')) {
      continue; // Skip the node entirely
    }

    // Shallow copy once, then apply multiple changes (Invariant: Reactivity)
    const updatedNode = { ...node };
    for (const change of nodeChanges) {
      if (change.type === 'position' && change.position) {
        updatedNode.position = change.position;
      } else if (change.type === 'select') {
        updatedNode.selected = change.selected;
      }
    }
    updatedNodes.push(updatedNode);
  }

  return [...updatedNodes, ...nodesToAdd];
}

/**
 * Transformation function (The "Essence of Internalization")
 * Maps a User Node to a System-ready Internal Node.
 */
export function toInternalNode(node: Node, parentPosition: XYPosition = { x: 0, y: 0 }): InternalNode {
  return {
    ...node,
    internals: {
      absolutePosition: {
        x: node.position.x + parentPosition.x,
        y: node.position.y + parentPosition.y,
      },
      z: 0,
    },
  };
}
