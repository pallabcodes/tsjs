/**
 * @zen-tui/solid: Sovereign RUC Node Definitions
 * 
 * Specialized terminal nodes for the Reactive Unidirectional Composition engine.
 * Optimized for high-frequency Git I/O and sub-millisecond reactivity.
 */

import { ZenProps } from '@zen-tui/node';

export type RUCNodeType = 'box' | 'txt' | 'root' | 'virtual';

export interface RUCNode {
  id: string;
  type: RUCNodeType;
  props: ZenProps;
  children: RUCNode[];
  parent?: RUCNode;
  nativeId?: number;
  
  // High-performance metadata for the compositor
  dirty: boolean;
  attached: boolean; // Added
  version: number;
}

let nextId = 0;
export const createRUCNode = (type: RUCNodeType, props: ZenProps = {}): RUCNode => ({
  id: `${type}-${nextId++}`,
  type,
  props,
  children: [],
  dirty: true,
  attached: false, // Added
  version: 0,
});

/**
 * NodeRegistry: Unidirectional source of truth for all active RUC nodes.
 */
export const registry = {
  root: createRUCNode('root'),
  nodes: new Map<string, RUCNode>(),
};
