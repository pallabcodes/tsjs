import { Point } from '../../inv02-viewport/src';

/**
 * Invariant 04: Handle & Connection Logic (Tiny Model)
 * 
 * This implementation captures the essence of xyflow's connection logic:
 * 1. Magnetic Snapping (Closest handle within radius)
 * 2. Connection Validation (Strict vs Loose modes)
 */

export type HandleType = 'source' | 'target';

export interface Handle extends Point {
  id: string;
  nodeId: string;
  type: HandleType;
}

export enum ConnectionMode {
  Strict = 'strict',
  Loose = 'loose'
}

export interface Connection {
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

/**
 * The "Magnetic" DNA of ReactFlow.
 * Finds the closest valid handle to a point.
 */
export function getClosestHandle(
  point: Point,
  handles: Handle[],
  connectionRadius: number,
  fromHandle: Handle
): Handle | null {
  let closestHandle: Handle | null = null;
  let minDistance = Infinity;

  for (const handle of handles) {
    // Invariant: Cannot connect to yourself (usually)
    if (handle.nodeId === fromHandle.nodeId && handle.id === fromHandle.id) {
      continue;
    }

    // Euclidean distance (The DNA)
    const distance = Math.sqrt(
      Math.pow(handle.x - point.x, 2) + Math.pow(handle.y - point.y, 2)
    );

    if (distance <= connectionRadius && distance < minDistance) {
      closestHandle = handle;
      minDistance = distance;
    }
  }

  return closestHandle;
}

/**
 * Validates a connection based on the mode.
 * Invariant: Logic separates geometry from graph rules.
 */
export function isValidConnection(
  connection: Connection,
  sourceType: HandleType,
  targetType: HandleType,
  mode: ConnectionMode
): boolean {
  // Invariant: Basic self-connection check
  if (connection.source === connection.target) {
    return false;
  }

  if (mode === ConnectionMode.Strict) {
    // Strict mode: Source must be 'source' and target must be 'target'
    return sourceType === 'source' && targetType === 'target';
  }

  // Loose mode: Just needs to be a valid graph edge (already checked target !== source)
  return true;
}
