/**
 * @zen-tui/solid: ZenTUI Compositor
 * 
 * High-performance terminal compositor.
 * Simplified for architectural finality.
 */

import { RUCNode, registry } from './node.js';
import { createComponent, createElement, insert, spread, createRenderEffect } from './universal.js';
import { getEngine } from '../index.js';

/**
 * h: Reactive JSX Passthrough (Google-Grade)
 * 
 * No longer performs manual reactive slotting.
 * Relies on the reconciler's 'insert' logic for all nested reactivity.
 */
export function h(tag: any, props: any, ...children: any[]): any {
  // 1. Functional Components
  if (typeof tag === 'function') {
    return createComponent(tag, { ...props, children });
  }

  // 2. Primitive Tags
  const node = createElement(tag);
  
  if (props) {
    // ╼ Reactive Property Tracking
    // We wrap property application in an effect to ensure SolidJS Proxies 
    // are correctly tracked and synchronized with the RUC node.
    createRenderEffect(() => {
      // ╼ Un-Proxy Synchronization
      // We shallow-copy props to trigger SolidJS Proxy getters and 
      // ensure the RUC tree receives the final values.
      spread(node, { ...props });
    });

    if (typeof props.ref === 'function') {
      props.ref(node);
    }
  }

  if (props.children || children.length > 0) {
    // ╼ Canonical Child Synchronization
    // We pass the entire child collection to SolidJS's 'insert' utility,
    // allowing the framework to handle topological ordering, markers, 
    // and reactive branching automatically.
    insert(node, props.children || (children.length > 1 ? children : children[0]));
  }

  return node;
}

/**
 * syncNativeNode: Precision terminal-viewport synchronization.
 */
export function syncNativeNode(node: RUCNode) {
  const engine = getEngine() as any;
  if (!engine || !engine.layout) return;
  const layout = engine.layout;
  const props = node.props || {};

  const flexDirection = props.flexDirection || "column";
  
  const mapDim = (val: any) => {
    if (typeof val === 'string' && val.endsWith('%')) return -parseFloat(val);
    return typeof val === 'number' ? val : null;
  };

  const w = mapDim(props.width || (node.type === 'root' ? 140 : (node.type === 'txt' ? String(props.value || '').length : null)));
  const h = mapDim(props.height || (node.type === 'root' ? 50 : (node.type === 'txt' ? 1 : null)));

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

  if (!node.attached && node.nativeId && node.parent?.nativeId) {
    layout.add_child(node.parent.nativeId, node.nativeId);
    node.attached = true;
  }

  // Recurse to children
  if (node.children) {
    for (const child of node.children) {
      if (child && typeof child === 'object') {
        child.parent = node;
        syncNativeNode(child);
      }
    }
  }
}
