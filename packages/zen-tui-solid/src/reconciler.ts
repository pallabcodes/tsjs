/**
 * @zen-tui/solid: Sovereign Reconciler Entry Point
 */

import { createZenRenderer } from './renderer.js';
import { ZenNode, ZenTextNode } from '@zen-tui/node';
import { 
  createZenElement, 
  createZenText, 
  replaceText, 
  insertNode, 
  setProperty, 
  removeNode 
} from './core/adapters.js';

// Re-export core context and linker
export * from './core/context.js';
export * from './core/linker.js';
export * from './core/adapters.js';

export { ZenNode, ZenTextNode };

/**
 * SolidJS Universal Reconciler Instance.
 */
export const renderer = createZenRenderer<ZenNode | ZenTextNode>({
  createElement: createZenElement,
  createTextNode: createZenText,
  replaceText,
  isTextNode: (node: ZenNode | ZenTextNode): node is ZenTextNode => node.type === 'text',
  insertNode: insertNode as any,
  setProperty,
  getProperty: (node: ZenNode | ZenTextNode, name: string) => (node.type === 'element' ? (node as ZenNode).props[name] : undefined),
  removeNode: removeNode as any,
  getParentNode: (node: ZenNode | ZenTextNode) => node.parent as ZenNode,
  getFirstChild: (node: ZenNode | ZenTextNode) => (node.type === 'element' ? (node as ZenNode).children[0] : undefined),
  getNextSibling: (node: ZenNode | ZenTextNode) => {
    const p = node.parent as ZenNode;
    if (!p) return undefined;
    const idx = p.children.indexOf(node);
    return idx !== -1 ? p.children[idx + 1] : undefined;
  }
});

/**
 * Universal Renderer interface aliases.
 */
export const { render, createComponent, insert, spread, use } = renderer as any;
