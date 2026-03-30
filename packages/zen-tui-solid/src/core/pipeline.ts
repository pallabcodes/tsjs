/**
 * @zen-tui/solid: Sovereign RUC Pipeline
 * 
 * Throttled rendering loop (60fps capped).
 * Synchronizes Virtual RUC tree with Native Layout Engine.
 */

import { registry } from './node.js';
import { syncNativeNode } from './compositor.js';
import { getEngine } from '../index.js';
import { flushTombstones } from './universal.js';

let frameId: any = null;
let lastFrameTime = 0;
const FRAME_MS = 16.67; // 60 FPS

/**
 * requestFrame: Throttled frame request to prevent infinite loops (Exit 137).
 */
export function requestFrame() {
  if (frameId) return;

  const now = Date.now();
  const delta = now - lastFrameTime;

  if (delta >= FRAME_MS) {
    runFrame();
  } else {
    frameId = setTimeout(runFrame, FRAME_MS - delta);
  }
}

/**
 * runFrame: Discrete rendering step (The "Story" Pipeline).
 */
let isSyncing = false;

/**
 * runFrame: Discrete rendering step (The "Story" Pipeline).
 */
function runFrame() {
  frameId = null;
  if (isSyncing) return;
  isSyncing = true;

  // ╼ Microtask Sync (Google-grade consistency)
  // Ensures Solid.js has finished 'Box' reconciliation before we flush.
  queueMicrotask(() => {
    internalRunFrame();
  });
}

function internalRunFrame() {
  try {
    const engine = getEngine() as any;
    if (!engine || !engine.layout) return;

    const layout = engine.layout;

    // 1. Flush GC Tombstones (Deterministic Memory Cleanup)
    const deadNodes = flushTombstones();
    for (const id of deadNodes) {
      layout.free_node(id);
    }
    
    // 2. Clear engine build state (v2 setup for stability)
    layout.clear();
    
    const resetNodes = (node: any) => {
      node.nativeId = undefined;
      node.attached = false;
      if (node.children) {
        for (const child of node.children) resetNodes(child);
      }
    };
    resetNodes(registry.root);

    // 2. Sync Hierarchy
    syncNativeNode(registry.root);

    // 3. Request Native Paint (flush)
    engine.flush(registry.root);
    
    lastFrameTime = Date.now();
  } finally {
    isSyncing = false;
  }
}

/**
 * startPipeline: Initialize the RUC rendering loop.
 */
export function startPipeline() {
  requestFrame();
}
