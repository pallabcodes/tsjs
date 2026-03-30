/**
 * @zen-tui/solid: Sovereign Universal Reconciler
 * 
 * Maps SolidJS fine-grained reactivity into the Native RUC Tree.
 * Zero DOM footprint. Runs natively in Node, Bun, and headless environments.
 * 
 * Architecture:
 *   solid-js/universal → createRenderer → RUCNode mutations → GC Tombstone Queue
 *   The 60FPS pipeline reads dirty flags and flushes tombstones to free Rust memory.
 */

import { createRenderer } from 'solid-js/universal';
import { RUCNode, createRUCNode } from './node.js';

let currentEngine: any = null;
export function setEngine(engine: any) { currentEngine = engine; }
export function getEngine() { return currentEngine; }

// ═══════════════════════════════════════════════════════════════════════════════
// GC Tombstone Queue: Tracks removed nodes for deterministic Rust memory cleanup.
// When solid-js/universal calls removeNode(), we don't destroy the Rust pointer
// immediately (that would race with an in-flight layout pass). Instead we push
// the nativeId into this queue. The pipeline's Commit Phase flushes it safely.
// ═══════════════════════════════════════════════════════════════════════════════
const gcTombstones: number[] = [];

/** Drain all pending tombstones. Returns the array of nativeIds to free. */
export function flushTombstones(): number[] {
  if (gcTombstones.length === 0) return [];
  return gcTombstones.splice(0, gcTombstones.length);
}

/** Read-only access for tests and diagnostics. */
export function peekTombstones(): ReadonlyArray<number> {
  return gcTombstones;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Custom Renderer: The bridge between SolidJS reactive DAG and our RUCNode tree.
// ═══════════════════════════════════════════════════════════════════════════════
export const {
  render,
  effect,
  memo,
  createComponent,
  createElement,
  createTextNode,
  insertNode,
  insert,
  spread,
  setProp,
  mergeProps,
  use
} = createRenderer<RUCNode>({
  createElement(tag: string) {
    return createRUCNode(tag as any);
  },
  
  createTextNode(value: string) {
    return createRUCNode('text', { value });
  },
  
  replaceText(textNode: RUCNode, value: string) {
    textNode.props.value = value;
    textNode.dirty = true;
  },
  
  setProperty(node: RUCNode, name: string, value: any) {
    node.props[name] = value;
    node.dirty = true;
    node.version++;
  },
  
  insertNode(parent: RUCNode, node: RUCNode, anchor?: RUCNode) {
    node.parent = parent;
    node.dirty = true;
    
    if (anchor) {
      const idx = parent.children.indexOf(anchor);
      if (idx !== -1) {
        parent.children.splice(idx, 0, node);
      } else {
        parent.children.push(node);
      }
    } else {
      parent.children.push(node);
    }
  },
  
  isTextNode(node: RUCNode) {
    return node.type === 'text';
  },
  
  removeNode(parent: RUCNode, node: RUCNode) {
    const idx = parent.children.indexOf(node);
    if (idx !== -1) {
      parent.children.splice(idx, 1);
    }
    node.parent = undefined;
    
    // GC Tombstone: If this node had a Rust-side pointer, queue it for cleanup.
    if (node.nativeId !== undefined) {
      gcTombstones.push(node.nativeId);
      node.nativeId = undefined;
    }
  },
  
  getParentNode(node: RUCNode) {
    return node.parent;
  },
  
  getFirstChild(node: RUCNode) {
    return node.children[0];
  },
  
  getNextSibling(node: RUCNode) {
    if (!node.parent) return undefined;
    const idx = node.parent.children.indexOf(node);
    if (idx === -1 || idx === node.parent.children.length - 1) return undefined;
    return node.parent.children[idx + 1];
  }
});
