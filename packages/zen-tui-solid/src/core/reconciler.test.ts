/**
 * @zen-tui/solid: Sovereign Reconciler Headless TDD
 * 
 * These tests run entirely without a terminal, DOM, or Rust engine.
 * They prove the Universal Renderer correctly tracks SolidJS reactive signals
 * and maps structural mutations into the RUCNode tree.
 * 
 * IMPORTANT: Must run with `bun --conditions=browser test` so solid-js resolves
 * to the reactive client runtime (solid.js) instead of the SSR no-op (server.js).
 * 
 * SolidJS batching note: Inside createRoot(), signal updates are batched.
 * We use test-level state to capture results after the root completes.
 */

import { test, expect, describe } from 'bun:test';
import { createSignal, createRoot, batch } from 'solid-js';
import { render, insert, setProp, createElement } from './universal.js';
import { createRUCNode } from './node.js';
import { flushTombstones, peekTombstones } from './universal.js';

// ═══════════════════════════════════════════════════════════════════════════════
// Test Suite 1: Structural Array Mutations (Conditional Rendering)
// ═══════════════════════════════════════════════════════════════════════════════
describe('Structural Mutations', () => {
  test('conditional swap via signal toggle', () => {
    let rootNode: any;
    let setMode: any;

    const dispose = render(() => {
      rootNode = createRUCNode('root');
      const [mode, _setMode] = createSignal('passive');
      setMode = _setMode;

      const PassiveFooter = () => createRUCNode('box', { value: 'PASSIVE' });
      const ActiveFooter = () => createRUCNode('box', { value: 'ACTIVE' });

      // insert() wraps function accessors in createRenderEffect internally.
      insert(rootNode, () => mode() === 'passive' ? PassiveFooter() : ActiveFooter());
      return rootNode;
    }, createRUCNode('root'));

    // After render completes, the initial state should be mounted
    expect(rootNode.children.length).toBe(1);
    expect(rootNode.children[0].props.value).toBe('PASSIVE');

    // Toggle signal — outside createRoot, this triggers immediately
    setMode('active');
    expect(rootNode.children.length).toBe(1);
    expect(rootNode.children[0].props.value).toBe('ACTIVE');

    // Toggle back
    setMode('passive');
    expect(rootNode.children.length).toBe(1);
    expect(rootNode.children[0].props.value).toBe('PASSIVE');

    dispose();
  });

  test('render() returns disposer and tracks reactive text via insert()', () => {
    const outerRoot = createRUCNode('root');
    let setCount: any;

    // SolidJS NEVER re-runs the top-level render function.
    // Reactivity works through fine-grained effects inside insert().
    const dispose = render(() => {
      const [count, _setCount] = createSignal(0);
      setCount = _setCount;
      const box = createRUCNode('box');
      // This is the correct reactive pattern: insert with a function accessor
      insert(box, () => createRUCNode('text', { value: `count-${count()}` }));
      return box;
    }, outerRoot);

    expect(outerRoot.children.length).toBe(1);
    const box = outerRoot.children[0];
    expect(box.children.length).toBe(1);
    expect(box.children[0].props.value).toBe('count-0');

    setCount(5);
    // The insert() effect re-runs, swapping the text node
    expect(box.children[0].props.value).toBe('count-5');

    dispose();
  });

  test('dynamic list rendering', () => {
    const outerRoot = createRUCNode('root');
    let setItems: any;

    const dispose = render(() => {
      const container = createRUCNode('box');
      const [items, _setItems] = createSignal(['a', 'b', 'c']);
      setItems = _setItems;
      insert(container, () => items().map(item => createRUCNode('box', { value: item })));
      return container;
    }, outerRoot);

    const container = outerRoot.children[0];
    expect(container.children.length).toBe(3);
    expect(container.children.map((c: any) => c.props.value)).toEqual(['a', 'b', 'c']);

    setItems(['x', 'y']);
    expect(container.children.length).toBe(2);
    expect(container.children.map((c: any) => c.props.value)).toEqual(['x', 'y']);

    dispose();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Test Suite 2: Property Patching
// ═══════════════════════════════════════════════════════════════════════════════
describe('Property Patching', () => {
  test('setProp updates node props and marks dirty', () => {
    const node = createRUCNode('box', { width: 100 });
    node.dirty = false; // reset after creation

    setProp(node, 'width', 200);

    expect(node.props.width).toBe(200);
    expect(node.dirty).toBe(true);
  });

  test('setProp increments version for change tracking', () => {
    const node = createRUCNode('box');
    const initialVersion = node.version;

    setProp(node, 'height', 50);

    expect(node.version).toBe(initialVersion + 1);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Test Suite 3: GC Tombstone Queue
// ═══════════════════════════════════════════════════════════════════════════════
describe('GC Tombstone Queue', () => {
  test('removeNode queues nativeId into tombstone array', () => {
    const outerRoot = createRUCNode('root');
    let setShow: any;

    // Flush leftover tombstones from prior tests
    flushTombstones();

    const dispose = render(() => {
      const container = createRUCNode('box');
      const [show, _setShow] = createSignal(true);
      setShow = _setShow;

      insert(container, () => {
        if (show()) {
          const node = createRUCNode('box', { value: 'ephemeral' });
          node.nativeId = 42;
          return node;
        }
        return null;
      });
      return container;
    }, outerRoot);

    const container = outerRoot.children[0];
    expect(container.children.length).toBe(1);

    // Remove the child by toggling signal
    setShow(false);

    // The nativeId=42 should now be in the tombstone queue
    const tombstones = flushTombstones();
    expect(tombstones).toContain(42);

    // After flush, queue should be empty
    expect(peekTombstones().length).toBe(0);

    dispose();
  });

  test('rapid toggle collects all tombstones', () => {
    const outerRoot = createRUCNode('root');
    let setShow: any;
    let nativeCounter = 100;

    flushTombstones();

    const dispose = render(() => {
      const container = createRUCNode('box');
      const [show, _setShow] = createSignal(true);
      setShow = _setShow;

      insert(container, () => {
        if (show()) {
          const node = createRUCNode('box', { value: 'toggle-child' });
          node.nativeId = nativeCounter++;
          return node;
        }
        return null;
      });
      return container;
    }, outerRoot);

    // Rapidly toggle 10 times
    for (let i = 0; i < 10; i++) {
      setShow(false);
      setShow(true);
    }

    // All removed nodes should have their nativeIds queued
    const tombstones = flushTombstones();
    expect(tombstones.length).toBeGreaterThan(0);
    // Every tombstone should be a valid nativeId (>= 100)
    for (const id of tombstones) {
      expect(id).toBeGreaterThanOrEqual(100);
    }

    dispose();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Test Suite 4: createElement integration
// ═══════════════════════════════════════════════════════════════════════════════
describe('createElement', () => {
  test('creates a valid RUCNode with correct type', () => {
    const node = createElement('box');
    expect(node.type).toBe('box');
    expect(node.children).toEqual([]);
    expect(node.dirty).toBe(true);
  });
});
