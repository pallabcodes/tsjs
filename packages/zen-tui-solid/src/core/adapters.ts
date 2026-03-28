/**
 * @zen-tui/solid: Sovereign Reconciler Adapters
 * 
 * Reconciler operations (create, set, insert) with stable 
 * property discriminators to prevent cross-package mismatches.
 */

import { ZenNode, ZenTextNode, getNextId } from '@zen-tui/node';
import { getActiveLayout } from './context.js';
import { syncNativeLink, syncStyle } from './linker.js';

/**
 * Creates a Virtual Node with a corresponding Native Node in the Layout Engine.
 */
export const createZenElement = (tag: string): ZenNode => {
  const layout = getActiveLayout();
  const node = new ZenNode(tag, {}, getNextId(tag));
  if (layout) {
    node.nativeId = layout.create_node("column", null, null);
  }
  return node;
};

/**
 * Creates a Virtual Text Node with a corresponding Native Node.
 */
export const createZenText = (text: string | number): ZenTextNode => {
  const layout = getActiveLayout();
  const content = String(text);
  const node = new ZenTextNode(content, undefined, getNextId('text'));
  if (layout) {
    node.nativeId = layout.create_node("row", content.length, 1);
  }
  return node;
};

/**
 * Updates Virtual Text content and native styling.
 */
export const replaceText = (node: ZenTextNode, value: string): void => {
  const layout = getActiveLayout();
  node.text = value;
  if (layout && node.nativeId) {
    layout.update_style(
      node.nativeId,
      "row",
      value.length,
      1,
      null, null, null, null, null, null, null
    );
  }
};

/**
 * Inserts a Virtual Node into a parent with Native synchronization.
 */
export const insertNode = (parent: ZenNode, node: ZenNode | ZenTextNode): void => {
  const layout = getActiveLayout();
  // Use discriminator '.type' instead of 'instanceof' to resolve cross-package issues.
  if (!parent || parent.type !== 'element') return;
  
  parent.children.push(node);
  node.parent = parent;

  if (layout && node.nativeId) {
    syncNativeLink(parent, node);
  }
};

/**
 * Sets properties on a node with style synchronization.
 */
export const setProperty = (node: ZenNode | ZenTextNode, name: string, value: any): void => {
  if (node.type === 'element') {
    node.props[name] = value; 
    const isStyleProp = ["width", "height", "flexDirection", "flexGrow", "gap", "fixedPosition", "top", "left"].includes(name);
    if (isStyleProp) syncStyle(node);
  } else if (node.type === 'text' && name === 'children') {
    replaceText(node as ZenTextNode, String(value));
  }
};

/**
 * Removes a Node from its parent and native layout.
 */
export const removeNode = (parent: ZenNode, node: ZenNode | ZenTextNode): void => {
  const layout = getActiveLayout();
  if (!parent || parent.type !== 'element') return;
  
  const index = parent.children.indexOf(node);
  if (index !== -1) {
    parent.children.splice(index, 1);
    node.parent = undefined;
    if (layout && parent.nativeId && node.nativeId) {
       layout.remove_child(parent.nativeId, node.nativeId);
    }
  }
};
