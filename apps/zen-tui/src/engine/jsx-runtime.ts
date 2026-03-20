/**
 * Zen-TUI: Sovereign JSX Runtime
 * 
 * A 100% custom, reactive JSX factory for the ZenEngine.
 * Guarantees zero-dependency on DOM/Web built-ins.
 */

import { createComponent, createRenderEffect } from 'solid-js';
import { renderer } from './reconciler.js';
import { ZenProps, ZenChild } from './node.js';

/**
 * Custom Reactive JSX Factory.
 * 
 * 1. Handles Functional Components via Solid's createComponent.
 * 2. Handles TUI Intrinsics (<box>, <text>) via the Zen reconciler.
 * 3. Bypasses all DOM-prefixed checks from solid-js/web.
 */
export function jsx(tag: any, props: any): any {
  // 1. Component Handling
  if (typeof tag === 'function') {
    return createComponent(tag, props);
  }

  // 2. Intrinsic Handling: <box>, <text>, etc.
  const node = renderer.createElement(tag);

  if (props) {
    for (const key in props) {
      if (key === 'children') {
        // Universal renderer handles children via its own reconcile pass.
        // We ensure they are reachable.
        (node as any)._jsx_children = props.children;
      } else {
        const value = props[key];

        // Handle reactivity: if a prop is a getter/function, track it
        if (typeof value === 'function' && key !== 'onSubmit') {
          createRenderEffect(() => {
            renderer.setProperty(node, key, value());
          });
        } else {
          renderer.setProperty(node, key, value);
        }
      }
    }
  }

  return node;
}

export const jsxs = jsx;
export const jsxDEV = jsx;
export const Fragment = (props: any) => props.children;

export namespace JSX {
  export type Element = ZenChild | ZenChild[] | any;

  export interface IntrinsicElements {
    box: ZenProps;
    text: ZenProps & { children?: Element };
    scrollbox: ZenProps;
    input: ZenProps;
  }
}
