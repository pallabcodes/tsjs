/**
 * @zen-tui/core: ZenTUI JSX Runtime
 * 
 * Provides the definitive reactive transform for the ZenNode virtual tree.
 * Optimized for architectural purity and high-performance Git visualization.
 */

import { createComponent, createElement, insert, spread } from './engine/universal';
import { type ZenNode } from '@zen-tui/node';

/**
 * 🏗️ jsx: Industrial JSX Transform Gateway.
 * 
 * Harmonizes the reactive transform for 'box', 'text', and functional components.
 * Strictly typed following the ZenTUI Industrial-Grade Excellence (V16).
 */
export function jsx(tag: string | Function, props: Record<string, unknown>, _key?: string): ZenNode | unknown {
  const { children, ...rest } = props || {};

  // 1. Functional Component Execution
  if (typeof tag === 'function') {
    return createComponent(tag, { ...rest, children });
  }

  // 2. Intrinsic Element Creation (box, text, etc.)
  const node = createElement(tag as string);
  
  if (rest) {
    spread(node, rest);
  }

  // 3. Recursive Child Insertion
  if (children !== undefined && children !== null) {
    insert(node, children);
  }

  return node;
}

export { jsx as jsxs, jsx as jsxDEV };
