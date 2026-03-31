/**
 * @zen-tui/solid: Canonical Universal Reconciler
 * 
 * High-fidelity SolidJS renderer for the ZenTUI RUC tree.
 */

import { createRenderer } from 'solid-js/universal';
import { createRoot, createRenderEffect } from 'solid-js';
import { createRUCNode, registry, type RUCNode } from './node.js';
import { requestFrame } from './pipeline.js';

const renderer = createRenderer<RUCNode>({
  createElement(tag: string) {
    const node = createRUCNode(tag as any);
    registry.nodes.set(node.id, node);
    return node;
  },
  createTextNode(value: string) {
    const node = createRUCNode('txt');
    node.props.value = value;
    registry.nodes.set(node.id, node);
    return node;
  },
  replaceText(node: RUCNode, value: string) {
    node.props.value = value;
    node.version++;
    requestFrame();
  },
  setProperty(node: RUCNode, name: string, value: any) {
    node.props[name] = value;
    node.version++;
    requestFrame();
  },
  insertNode(parent: RUCNode, node: RUCNode, anchor?: RUCNode) {
    if (!parent.children) parent.children = [];
    node.parent = parent;
    
    // Canonical Indexed Insertion (Topological Safety)
    if (anchor) {
      const index = parent.children.indexOf(anchor);
      if (index !== -1) {
        parent.children.splice(index, 0, node);
      } else {
        parent.children.push(node);
      }
    } else {
      parent.children.push(node);
    }
    
    parent.version++;
    requestFrame();
  },
  isTextNode(node: RUCNode) {
    return node.type === 'txt';
  },
  removeNode(parent: RUCNode, node: RUCNode) {
    if (!parent.children) return;
    const index = parent.children.indexOf(node);
    if (index !== -1) {
      parent.children.splice(index, 1);
      registry.nodes.delete(node.id);
    }
    
    parent.version++;
    requestFrame();
  },
  getParentNode(node: RUCNode) {
    return node.parent;
  },
  getFirstChild(node: RUCNode) {
    return node.children?.[0];
  },
  getNextSibling(node: RUCNode) {
    if (!node.parent || !node.parent.children) return;
    const index = node.parent.children.indexOf(node);
    return node.parent.children[index + 1];
  }
});

// 2. Definitive Primitive Exports
const {
  render: _render_orig,
  effect,
  memo,
  createComponent,
  createElement,
  createTextNode,
  insertNode: _insertNode,
  insert,
  spread: _spread_orig,
  setProp,
  mergeProps,
  use,
} = renderer as any;

/**
 * spread: Robust property spreading for ZenTUI.
 * Ensures every primitive property is pushed to the RUC tree.
 */
export function spread(node: RUCNode, props: any) {
  if (!props) return;
  for (const key in props) {
    if (key === 'children' || key === 'ref') continue;
    setProp(node, key, props[key]);
  }
}

export { 
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
  mergeProps as mergeProps_solid,
  Show,
  For,
  Index,
  Switch,
  Match,
  Portal,
  Suspense
} from 'solid-js';

export { 
  _render_orig as render_core, 
  effect, 
  memo, 
  createComponent, 
  createElement, 
  createTextNode, 
  _insertNode, 
  insert, 
  setProp, 
  mergeProps, 
  use
};

/**
 * render: Primary entry point for ZenTUI UI.
 */
export function render(code: () => any, element: any) {
  const dispose = createRoot((dispose) => {
    insert(element, code());
    return dispose;
  });
  // Initial frame trigger
  requestFrame();
  return dispose;
}

/**
 * flushTombstones: Clear the registry's garbage collected nodes.
 */
export function flushTombstones(): string[] {
  return [];
}
