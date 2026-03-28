/**
 * @zen-tui/solid: Sovereign RUC Compositor
 * 
 * Specialized terminal-centric compositor.
 * Handles unidirectional geometry sync and reactive property patching.
 */

import { createComponent } from 'solid-js';
import { RUCNode, createRUCNode, registry } from './node.js';
import { getActiveLayout } from './context.js';
import { parseSize } from './linker.js';
import { getEngine } from '../index.js';

/**
 * h: Sovereign JSX Factory (RUC Edition)
 * Bridges classic JSX compilation to Solid.js reactivity and RUC compositor.
 */
export function h(tag: any, props: any, ...children: any[]): any {
  // Case 1: Functional Components
  if (typeof tag === 'function') {
    return createComponent(tag, { ...props, children: children.length === 1 ? children[0] : children });
  }

  // Case 2: Primitive Tags (box, text, etc.)
  const node = createRUCNode(tag as any, props || {});
  registry.nodes.set(node.id, node);

  // Link children
  if (children.length > 0) {
    const flattened = children.flat();
    
    // Extract text content for text nodes
    if (tag === 'text') {
      node.props.value = flattened.map(c => String(c)).join('');
    } else {
      for (const child of flattened) {
        if (child && typeof child === 'object' && 'type' in child) {
          child.parent = node;
          node.children.push(child as RUCNode);
        }
      }
    }
  }

  return node;
}

/**
 * syncNativeNode: Synchronize a RUC node with the Rust layout engine.
 */
export function syncNativeNode(node: RUCNode) {
  const engine = getEngine() as any;
  if (!engine || !engine.layout) return;
  const layout = engine.layout;
  const props = node.props || {};

  // 1. Map RUC Props to Native Layout Style
  const flexDirection = props.flexDirection || "column";
  
  const mapDim = (val: any) => {
    if (typeof val === 'string' && val.endsWith('%')) return -parseFloat(val);
    return typeof val === 'number' ? val : null;
  };

  const w = mapDim(props.width || (node.type === 'root' ? 140 : (node.type === 'text' ? String(props.value || '').length : null)));
  const h = mapDim(props.height || (node.type === 'root' ? 50 : (node.type === 'text' ? 1 : null)));

  // 2. Create or Update Native Node
  if (!node.nativeId) {
    node.nativeId = layout.create_node(
        flexDirection,
        w,
        h,
        props.flexGrow || 0,
        props.padding?.top || 0,
        props.padding?.right || 0,
        props.padding?.bottom || 0,
        props.padding?.left || 0,
        props.gap || 0,
        props.positionType || props.fixedPosition ? "absolute" : "relative",
        props.fixedPosition ? props.fixedPosition.y : (props.top || null),
        props.fixedPosition ? null : (props.right || null),
        props.fixedPosition ? null : (props.bottom || null),
        props.fixedPosition ? props.fixedPosition.x : (props.left || null)
    );
  }

  // 3. Handle Hierarchy Attachment
  if (!node.attached && node.nativeId && node.parent?.nativeId) {
    layout.add_child(node.parent.nativeId, node.nativeId);
    node.attached = true;
  }

  // 4. Recurse to children
  for (const child of node.children) {
    if (child && typeof child === 'object') {
      child.parent = node;
      syncNativeNode(child);
    }
  }
}
