/**
 * @zen-tui/solid: Global Reactive Bridge
 * 
 * The Unified, persistence-safe Source of Truth for the ZenTUI framework.
 * Eliminates monorepo signal isolation by anchoring primitives to globalThis.
 */

import * as solid from 'solid-js';

// 0. ZenTUI Global Handshake
const G = (globalThis as any);
if (!G.__ZenTUI_BRIDGE__) {
  G.__ZenTUI_BRIDGE__ = {
    ...solid,
  };
}

// 1. Core Reconciler & Pipeline
export * from './core/universal.js';
export * from './core/compositor.js';
export * from './core/node.js';
export * from './core/pipeline.js';
export * from './core/context.js';

// 2. High-Performance Widgets
export * from './widgets/PulseDashboard.js';
export * from './widgets/Sparkline.js';
export * from './widgets/FileTree.js';
export * from './widgets/CommandInput.js';
export * from './widgets/DiffViewer.js';
export * from './widgets/GitGraph.js';

// 2. Definitive Primitive Exports (Sovereign Threading)
// 2. Definitive Primitive Exports (Sovereign Threading)
export {
  render,
  render_core,
} from './core/universal.js';

export {
  h,
  syncNativeNode,
} from './core/compositor.js';

export {
  registry,
  flushTombstones,
} from './core/node.js';

export {
  getEngine,
  setEngine,
} from './core/pipeline.js';

export {
  Show,
  For,
  Portal,
  Suspense,
  createSignal,
  createEffect,
  createMemo,
  createResource,
  onMount,
  onCleanup,
  createRoot,
  createRenderEffect,
  useContext,
  createContext,
  batch,
  untrack,
  splitProps,
} from './core/universal.js';
G.__ZenTUI_BRIDGE__;

import { h } from './core/compositor.js';

// 4. ZenTUI JSX Primitives
export function Box(props: any) {
  return h('box', props, props.children);
}

export function Text(props: any) {
  return h('txt', props);
}

/**
 * Show: Standard branching primitive.
 */
export { Show, For, Index, Switch, Match } from 'solid-js';

import type { RUCNode } from './core/node.js';
export type { RUCNode };
