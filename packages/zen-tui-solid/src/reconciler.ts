/**
 * Zen-TUI: Sovereign Reconciler Adapters
 * 
 * Bridges the official Universal SolidJS core with our
 * custom ZenNode tree and Rust-taffy layout.
 */

import { ZenNode, ZenTextNode, getNextId, IZenLayoutEngine } from '@zen-tui/core';
import { createZenRenderer } from './renderer.js';

let activeLayout: IZenLayoutEngine | null = null;

export const setLayoutEngine = (engine: IZenLayoutEngine) => {
  activeLayout = engine;
};

const parseSize = (val: any) => {
  if (typeof val === 'number') return val;
  if (typeof val === 'string' && val.endsWith('%')) {
    return -parseFloat(val); // Backwards negative percentages compatibility
  }
  return null;
};

import fs from 'fs';

// 1. Define the Low-Level Adapters (SPI)
export const createElement = (tag: string): ZenNode => {
  const node = new ZenNode(tag, {}, getNextId(tag));
  if (activeLayout) {
    node.nativeId = activeLayout.createNode("column", null, null, 0, 0, 0, 0, 0, 0, null, null, null, null, null);
  }
  console.log(`[RECONCILER] CreateElement: ${tag} -> Native: ${node.nativeId}`);
  return node;
};

export const createTextNode = (text: string | number): ZenTextNode => {
  const node = new ZenTextNode(String(text), undefined, getNextId('text'));
  if (activeLayout) {
    node.nativeId = activeLayout.createNode("row", String(text).length, 1, 0, 0, 0, 0, 0, 0, null, null, null, null, null);
  }
  return node;
};

export const replaceText = (node: ZenNode | ZenTextNode, value: string): void => {
  if (node instanceof ZenTextNode) {
    node.text = value;
  }
};

export const isTextNode = (node: ZenNode | ZenTextNode): boolean => {
  return node instanceof ZenTextNode;
};

export const insertNode = (parent: ZenNode | ZenTextNode, node: ZenNode | ZenTextNode, anchor?: ZenNode | ZenTextNode): void => {
  if (!(parent instanceof ZenNode)) return;
  console.log(`[RECONCILER] Insert: ${node instanceof ZenNode ? node.tag : 'text'} Into: ${parent.tag} (P_Native: ${parent.nativeId}, N_Native: ${node.nativeId})`);
  
  if (anchor) {
    const index = parent.children.indexOf(anchor as any);
    if (index !== -1) {
      parent.children.splice(index, 0, node as any);
      node.parent = parent;
      if (activeLayout && parent.nativeId && node.nativeId) {
        activeLayout.addChild(parent.nativeId, node.nativeId);
      }
      return;
    }
  }
  parent.children.push(node as any);
  node.parent = parent;
  if (activeLayout && parent.nativeId && node.nativeId) {
    try {
      activeLayout.addChild(parent.nativeId, node.nativeId);
      fs.appendFileSync('zen-verify.log', `[RECONCILER] AddChild Success: P=${parent.nativeId} C=${node.nativeId}\n`);
    } catch (e: any) {
      fs.appendFileSync('zen-verify.log', `[FATAL ADD_CHILD] Error: ${e.message || e}\n`);
    }
  }
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
    if (activeLayout && parent.nativeId && node.nativeId) {
       activeLayout.removeChild(parent.nativeId, node.nativeId);
    }
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
  replaceText,
  isTextNode,
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
