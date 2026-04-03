/**
 * @zen-tui/core: ZenTUI Rendering Pipeline (Native Edition)
 * 
 * Manages frame scheduling and synchronization between 
 * the Virtual Tree and the Native Rust Engine.
 */

import { registry, type ZenEngine } from './node';
import { syncNativeNode } from './compositor';
import { computeLayout } from './layout';

let frameId: ReturnType<typeof setTimeout> | null = null;
let currentEngine: ZenEngine | null = null;

export function getEngine(): ZenEngine | null {
  return currentEngine;
}

export function setEngine(engine: ZenEngine) {
  currentEngine = engine;
}

/**
 * requestFrame: Schedules a reactive display synchronization.
 * USES A DEBOUNCED 60FPS TARGET FOR TERMINAL RESPONSIVENESS.
 */
export function requestFrame() {
  if (frameId) return;

  frameId = setTimeout(() => {
    runFrame();
    frameId = null;
  }, 16);
}

/**
 * runFrame: The definitive ZenTUI display synchronization step.
 * 
 * 1. Orchestrates the Virtual Render List (Z-Order, Flattening)
 * 2. Purges the Native Buffer to prevent ghosting
 * 3. Synchronizes Virtual Node properties to Native Bridge
 * 4. Flushes the Native Buffer (Single Syscall Display Swap)
 */
function runFrame() {
  if (!currentEngine || !currentEngine.painter) return;

  // 1. ZenTUI Geometric Reflow: Calculate precise grid coordinates
  computeLayout(
    registry.root, 
    currentEngine.painter.getWidth(), 
    currentEngine.painter.getHeight()
  );

  // 2. Industrial Orchestration: Z-Order and Flattening
  registry.buildRenderList();

  // 3. Frame Purge: Clear the native bridge for the next pass
  currentEngine.painter.clear();

  // 4. Unidirectional Sync Traversal
  const renderList = registry.getRenderList();
  for (const node of renderList) {
      syncNativeNode(node);
  }

  // 5. Native Flush: Atomic TTY update
  currentEngine.painter.flush();
}

/**
 * startPipeline: Ignite the high-performance display loop.
 */
export function startPipeline() {
  requestFrame();
}
