import { Node } from '../../inv01-model/src/index.ts';
import { Viewport } from '../../inv02-viewport/src/index.ts';

/**
 * Invariant 11: Persistence (Tiny Model)
 * 
 * This implementation captures the essence of xyflow's serialization:
 * 1. Minimum Sufficient State.
 * 2. Separation of Core vs Derived state.
 */

export interface SerializedFlow {
  nodes: Node[];
  edges: any[];
  viewport: Viewport;
}

/**
 * The "Serialization" DNA.
 * Strips away system-calculated metadata to return a clean JSON object.
 */
export function serialize(
  nodes: Node[],
  edges: any[],
  viewport: Viewport
): SerializedFlow {
  return {
    // In a real system, we might strip internal fields here
    nodes: nodes.map(n => ({ ...n })),
    edges: edges.map(e => ({ ...e })),
    viewport: { ...viewport }
  };
}

/**
 * The "Hydration" DNA.
 * Reconstructs the internal system reality from a serialized object.
 */
export function hydrate(data: SerializedFlow) {
  // Invariant: The system is ready to calculate 'Derived State'
  // (Absolute positions, Handle bounds, etc) from this core data.
  return {
    nodes: data.nodes,
    edges: data.edges,
    viewport: data.viewport,
    initialized: true
  };
}
