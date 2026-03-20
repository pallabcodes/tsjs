/**
 * Zen-TUI: Sovereign Reconciler Configuration
 * 
 * Bridges the Zen-Renderer core with our virtual ZenNode tree
 * and Rust-powered layout engine.
 */

import { createZenRenderer } from './renderer.js';
import { ZenNode, ZenTextNode, ZenProps } from './node.js';
import { getNextId } from './utils.js'; // Assuming utility or manual ID

// Industrial reconciler implementation
export const renderer = createZenRenderer<ZenNode | ZenTextNode>({
  createElement(tag: string): ZenNode {
    return new ZenNode(tag, {}, getNextId(tag));
  },

  createTextNode(text: string | number): ZenTextNode {
    return new ZenTextNode(String(text), undefined, getNextId('text'));
  },

  insertNode(parent: ZenNode | ZenTextNode, node: ZenNode | ZenTextNode, anchor?: ZenNode | ZenTextNode): void {
    if (!(parent instanceof ZenNode)) return;
    
    // Anchor logic for ordered insertion
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
  },

  removeNode(parent: ZenNode | ZenTextNode, node: ZenNode | ZenTextNode): void {
    if (!(parent instanceof ZenNode)) return;
    const index = parent.children.indexOf(node as any);
    if (index !== -1) {
      parent.children.splice(index, 1);
      node.parent = undefined;
    }
  },

  setProperty(node: ZenNode | ZenTextNode, name: string, value: any, prev?: any): void {
    if (node instanceof ZenNode) {
      (node.props as any)[name] = value;
    } else if (node instanceof ZenTextNode && name === 'children') {
        node.text = String(value);
    }
  },

  getParentNode(node: ZenNode | ZenTextNode): ZenNode | undefined {
    return node.parent as ZenNode;
  },

  getFirstChild(node: ZenNode | ZenTextNode): ZenNode | ZenTextNode | undefined {
    if (node instanceof ZenNode) return node.children[0];
    return undefined;
  },

  getNextSibling(node: ZenNode | ZenTextNode): ZenNode | ZenTextNode | undefined {
    const parent = node.parent as ZenNode;
    if (!parent) return undefined;
    const index = parent.children.indexOf(node as any);
    if (index === -1) return undefined;
    return parent.children[index + 1];
  },

  isTextNode(node: ZenNode | ZenTextNode): node is ZenTextNode {
    return node instanceof ZenTextNode;
  },

  replaceText(node: ZenNode | ZenTextNode, value: string): void {
    if (node instanceof ZenTextNode) {
      node.text = value;
    }
  }
});

// Re-export core reactive primitives from our sovereign renderer
import { createMemo, createRenderEffect, mergeProps } from 'solid-js';

export const {
  render,
  insert,
  spread,
  createElement,
  createTextNode,
  insertNode,
  setProp,
  createComponent,
  use
} = renderer;

export { createMemo as memo, createRenderEffect as effect, mergeProps };
