/**
 * @zen-tui/core: ZenTUI Universal Reconciler (Hardened Edition)
 */

import { createRenderer } from 'solid-js/universal';
import { 
  Zen, 
  createRoot, 
} from './reactivity';

import { createZenNode, type ZenNode, type ZenNodeType } from './node';

const renderer = createRenderer<ZenNode>({
  createElement(tag: string) {
    return createZenNode(tag as ZenNodeType);
  },
  createTextNode(value: string) {
    const node = createZenNode('text');
    node.props.value = value;
    return node;
  },
  replaceText(node: ZenNode, value: string) {
    node.props.value = value;
    node.markDirty();
  },
  setProperty(node: ZenNode, name: string, value: unknown) {
    (node.props as any)[name] = value;
    node.markDirty();
  },
  insertNode(parent: ZenNode, node: ZenNode, anchor?: ZenNode) {
    parent.insertNode(node, anchor);
  },
  isTextNode(node: ZenNode) {
    return node.type === 'text';
  },
  removeNode(parent: ZenNode, node: ZenNode) {
    parent.removeChild(node);
  },
  getParentNode(node: ZenNode) {
    return node.parent;
  },
  getFirstChild(node: ZenNode) {
    return node.children?.[0];
  },
  getNextSibling(node: ZenNode) {
    if (!node.parent) return undefined;
    const index = (node.parent as any)._children.indexOf(node);
    if (index === -1) return undefined;
    return (node.parent as any)._children[index + 1];
  }
});

/**
 * 🧱 Framework Primitives: Core solid-core re-exports.
 */
export const {
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
 */
export function spread(node: ZenNode, props: Record<string, unknown>) {
  if (!props) return;
  for (const key in props) {
    if (key === 'children' || key === 'ref') continue;
    setProp(node, key, props[key]);
  }
}

// ╼ Re-export the sovereign bridge
export * from './reactivity';

export { 
  _render_orig as render_core, 
  mergeProps as mergeProps_core, 
};

/**
 * render: Primary entry point for ZenTUI UI.
 */
export function render(code: () => any, element: ZenNode) {
  const dispose = createRoot((dispose) => {
    insert(element, code());
    return dispose;
  });
  return dispose;
}
