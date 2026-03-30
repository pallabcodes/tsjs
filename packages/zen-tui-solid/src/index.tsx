/**
 * @zen-tui/solid: Sovereign TUI Framework (RUC Architecture)
 * 
 * High-performance, declarative TUI framework utilizing Reactive 
 * Unidirectional Composition (RUC) for sub-millisecond Git UI performance.
 */

import { 
  createSignal, 
  createEffect, 
  createMemo, 
  onMount, 
  onCleanup, 
  batch, 
  Show, 
  For,
  JSX,
  createComponent,
  createRoot
} from 'solid-js';

export { 
  createSignal, 
  createEffect, 
  createMemo, 
  onMount, 
  onCleanup, 
  batch, 
  Show, 
  For,
  createRoot
};

// --- Sovereign RUC Core ---
export * from './core/universal.js';
import { registry, type RUCNode } from './core/node.js';
import { requestFrame, startPipeline } from './core/pipeline.js';
import { setLayoutEngine, dispatchInput, useInput } from './core/context.js';

export { 
  registry, 
  requestFrame, 
  startPipeline,
  setLayoutEngine, 
  dispatchInput, 
  useInput
};

export type { RUCNode };

/**
 * render: RUC Bootstrap.
 * Connects the Solid.js reactive Root to the Sovereign RUC pipeline.
 */
import { render as universalRender, getEngine } from './core/universal.js';

export { getEngine };

export function render(code: () => any, container: any) {
  // 1. Establish the Root Link
  registry.root.nativeId = container.nativeId;
  const dispose = universalRender(code, registry.root);

  // 2. Start the Throttled Pipeline
  startPipeline();

  return dispose;
}

// Domain Types
import type { ZenInputEvent } from '@zen-tui/core';
export type { ZenInputEvent };

// Clean Leaf Modules (Broken Circularity)
export * from './primitives.js';
export * from './utils.js';

// --- Composite Primitives ---
export * from './components/Tabs.js';
export * from './components/Modal.js';
export * from './components/StatusBar.js';
export * from './components/ProgressBar.js';
export * from './widgets/Sparkline.js';
export * from './widgets/GitGraph.js';
export * from './widgets/PulseDashboard.js';
export * from './widgets/FileTree.js';
export * from './widgets/DiffViewer.js';
export * from './widgets/CommandInput.js';

/**
 * <List />: Premium focusable vertical list (RUC Edition).
 */
export interface ListProps<T> {
  each: T[] | (() => T[]);
  renderItem: (item: T, isSelected: boolean) => JSX.Element;
  onSelect?: (index: number) => void;
  focused?: boolean | (() => boolean);
}

import { Box, Text } from './primitives.js';

export const List = <T,>(props: ListProps<T>): any => {
  const [selected, setSelected] = createSignal(0);
  const items = createMemo(() => {
    const data = typeof props.each === 'function' ? props.each() : props.each;
    return Array.isArray(data) ? data : [];
  });

  const isFocused = () => typeof props.focused === 'function' ? props.focused() : !!props.focused;

  useInput((e: ZenInputEvent) => {
    if (!isFocused()) return;
    const count = items().length;
    if (count === 0) return;

    if (e.name === 'j' || e.name === 'down') {
      const next = Math.min(selected() + 1, count - 1);
      if (next !== selected()) {
        setSelected(next);
        props.onSelect?.(next);
        requestFrame();
      }
    } else if (e.name === 'k' || e.name === 'up') {
      const next = Math.max(selected() - 1, 0);
      if (next !== selected()) {
        setSelected(next);
        props.onSelect?.(next);
        requestFrame();
      }
    }
  });

  return (
    <Box flexDirection="column" bg="#020617">
      <For each={items()}>
        {(item, index) => props.renderItem(item, index() === selected())}
      </For>
    </Box>
  );
};
