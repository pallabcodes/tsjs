/** @jsx h */
/**
 * @zen-tui/solid: Sovereign RUC Primitives
 * 
 * Direct RUC proxies for the high-performance TUI compositor.
 */

import { ZenProps } from '@zen-tui/node';
import { createRUCNode, registry } from './core/node.js';
import { requestFrame } from './core/pipeline.js';
import { createRenderEffect, children } from 'solid-js';

export interface ZenComponentProps extends ZenProps {
  children?: any;
}

/**
 * Box: High-performance flexbox container.
 */
export const Box = (props: ZenComponentProps): any => {
  const node = createRUCNode('box', props);
  registry.nodes.set(node.id, node);

  // Link Children (Immediate + Reactive Resolution)
  const resolved = children(() => props.children);
  const sync = () => {
    const flattened = Array.isArray(resolved()) ? (resolved() as any[]).flat() : [resolved()];
    node.children = []; 
    for (const child of flattened) {
      if (child && typeof child === 'object' && 'type' in child) {
        child.parent = node;
        node.children.push(child);
      }
    }
    Object.assign(node.props, props);
    node.dirty = true;
    requestFrame();
  };

  createRenderEffect(sync);
  sync(); // Force immediate first-pass sync

  return node;
};

/**
 * Text: Precision typography node.
 */
export const Text = (props: ZenComponentProps): any => {
  const node = createRUCNode('text', props);
  registry.nodes.set(node.id, node);

  // Link Children (Immediate + Reactive Resolution)
  const resolved = children(() => props.children);
  const sync = () => {
    Object.assign(node.props, props);
    const content = resolved();
    node.props.value = Array.isArray(content) 
      ? content.map(c => String(c)).join('') 
      : String(content || '');
    node.dirty = true;
    requestFrame();
  };

  createRenderEffect(sync);
  sync(); // Force immediate first-pass sync

  return node;
};

/**
 * Panel: Bordered container primitive.
 */
export const Panel = (props: ZenComponentProps): any => {
  return Box({ ...props, border: true });
};
