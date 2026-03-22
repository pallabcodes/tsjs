/**
 * Zen-TUI: Sovereign Reconciler Adapters
 * 
 * Bridges the official Universal SolidJS core with our
 * custom ZenNode tree and Rust-taffy layout.
 */

import { ZenNode, ZenTextNode, getNextId } from '@zen-tui/core';
import { createZenRenderer } from './renderer.js';

/**
 * SolidJS Universal Adapter Interface.
 * 
 * We provide the low-level 'How to manipulate a ZenNode' logic.
 * Solid's createRenderer provides the high-level 'When to update' logic.
 */
// 1. Define the Low-Level Adapters (SPI)
export const createElement = (tag: string): ZenNode => {
  import('fs').then(fs => fs.appendFileSync('zen-verify.log', `[RECONCILER] createElement: ${tag}\n`));
  return new ZenNode(tag, {}, getNextId(tag));
};

export const createTextNode = (text: string | number): ZenTextNode => {
  return new ZenTextNode(String(text), undefined, getNextId('text'));
};

export const replaceNode = (parent: ZenNode | ZenTextNode, newNode: ZenNode | ZenTextNode, oldNode: ZenNode | ZenTextNode): void => {
  if (!(parent instanceof ZenNode)) return;
  const index = parent.children.indexOf(oldNode as any);
  if (index !== -1) {
    parent.children[index] = newNode as any;
    newNode.parent = parent;
    oldNode.parent = undefined;
  }
};

export const insertNode = (parent: ZenNode | ZenTextNode, node: ZenNode | ZenTextNode, anchor?: ZenNode | ZenTextNode): void => {
  import('fs').then(fs => fs.appendFileSync('zen-verify.log', `[RECONCILER] insertNode called\n`));

  if (!(parent instanceof ZenNode)) return;
  if (anchor) {
    const index = parent.children.indexOf(anchor as any);
    if (index !== -1) {
      parent.children.splice(index, 0, node as any);
      node.parent = parent;
      return;
    }
  }
  parent.children.push(node as any);
  node.parent = parent;
};

export const setProperty = (node: ZenNode | ZenTextNode, name: string, value: any): void => {
  if (node instanceof ZenNode) {
    (node.props as any)[name] = value;
  } else if (node instanceof ZenTextNode && name === 'children') {
    node.text = String(value);
  }
};

export const getProperty = (node: ZenNode | ZenTextNode, name: string): any => {
  if (node instanceof ZenNode) return (node.props as any)[name];
  if (node instanceof ZenTextNode && name === 'children') return node.text;
};

export const removeNode = (parent: ZenNode | ZenTextNode, node: ZenNode | ZenTextNode): void => {
  if (!(parent instanceof ZenNode)) return;
  const index = parent.children.indexOf(node as any);
  if (index !== -1) {
    parent.children.splice(index, 1);
    node.parent = undefined;
  }
};

export const getParentNode = (node: ZenNode | ZenTextNode): ZenNode | undefined => {
  return node.parent as ZenNode;
};

export const getFirstChild = (node: ZenNode | ZenTextNode): ZenNode | ZenTextNode | undefined => {
  if (node instanceof ZenNode) return node.children[0];
  return undefined;
};

export const getNextSibling = (node: ZenNode | ZenTextNode): ZenNode | ZenTextNode | undefined => {
  const parent = node.parent as ZenNode;
  if (!parent) return undefined;
  const index = parent.children.indexOf(node as any);
  if (index === -1) return undefined;
  return parent.children[index + 1];
};

// 2. Initialize the High-Level Universal Reconciler
export const renderer = createZenRenderer<ZenNode | ZenTextNode>({
  createElement,
  createTextNode,
  replaceNode,
  insertNode,
  setProperty,
  getProperty,
  removeNode,
  getParentNode,
  getFirstChild,
  getNextSibling
});

// 3. Export High-Level Controllers for JSX Runtime
export const {
  render,
  insert,
  spread,
  createComponent,
  use,
} = renderer;

// 4. Aliases for Compatibility
export const setProp = setProperty;

// @ts-ignore
import { 
  createSignal, 
  createEffect, 
  createMemo, 
  createRenderEffect, 
  onMount, 
  onCleanup, 
  untrack, 
  batch, 
  mergeProps,
  For,
  Show,
  Index,
  Switch,
  Match
} from "solid-js";

export { 
  createSignal, 
  createEffect, 
  createMemo, 
  createRenderEffect, 
  onMount, 
  onCleanup, 
  untrack, 
  batch, 
  mergeProps,
  For,
  Show,
  Index,
  Switch,
  Match,
  createMemo as memo, 
  createRenderEffect as effect 
};
