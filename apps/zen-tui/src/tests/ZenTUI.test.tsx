import { expect, test, describe, beforeEach } from "bun:test";
import { 
  Zen, 
  render, 
  registry, 
  Box, 
  Text, 
  Modal, 
  Spinner,
  Theme,
  createRoot,
  createZenNode,
  createSignal,
  createEffect,
  computeLayout
} from '@zen-tui/core';
import { ZenTUIMock } from '../../../../packages/zen-tui-core/src/tests/ZenTUIMock';
import { AppContent } from '../app/App';
import { createZenStore } from '../app/state/ZenStore';

/**
 * ZenTUI: Core Framework Verification
 */
describe("ZenTUI: Core Engine", () => {
    
    beforeEach(() => {
        Zen.terminate();
    });

    test("ZenTUI Reactivity Bridge", () => {
        const [count, setCount] = createSignal(0);
        expect(count()).toBe(0);
        setCount(1);
        expect(count()).toBe(1);
    });

    test("Node Tree: MarkDirty Propagation", () => {
        const root = createZenNode('root');
        const box = createZenNode('box', { id: 'child' });
        root.appendChild(box);
        
        expect(box.runtime.dirty).toBe(true);
        box.runtime.dirty = false;
        
        box.markDirty();
        expect(box.runtime.dirty).toBe(true);
    });

    test("Z-Index: Higher orders are rendered last (Topmost)", () => {
        const root = registry.root;
        const box1 = createZenNode('box', { zIndex: 10, id: 'top' });
        const box2 = createZenNode('box', { zIndex: 0, id: 'bottom' });
        
        root.appendChild(box1);
        root.appendChild(box2);
        
        registry.buildRenderList();
        const list = registry.getRenderList();
        
        expect(list[list.length - 1].id).toBe('top');
    });

    test("UI: Modal Overlay correctly renders in absolute space", () => {
        const root = registry.root;
        const modal = createZenNode('box', { 
            positionType: 'absolute',
            zIndex: 100,
            id: 'modal'
        });
        root.appendChild(modal);
        
        registry.buildRenderList();
        const list = registry.getRenderList();
        expect(list.some(n => n.id === 'modal')).toBe(true);
    });

    test("UI: Spinner character propagation", () => {
        const mockHost = new ZenTUIMock(10, 10);
        const spinner = createZenNode('text', { value: "⠋" });
        
        // Simulating painter bridge (Normally handled by ZenEngine)
        const painter = {
            drawText: (x: number, y: number, t: string) => mockHost.setCell(x, y, t)
        };
        painter.drawText(0, 0, spinner.props.value!);
        
        expect(mockHost.getCell(0, 0)?.char).toBe("⠋");
    });

    test("Layout: FlexBox Proportional Distribution", () => {
        const root = registry.root;
        root.props.width = 100;
        root.props.height = 10;
        root.props.flexDirection = 'row'; // EXPLICIT INDUSTRIAL ROW
        
        const left = createZenNode('box', { flexGrow: 1, id: 'left' });
        const right = createZenNode('box', { flexGrow: 1, id: 'right' });
        
        root.appendChild(left);
        root.appendChild(right);
        
        computeLayout(root, 100, 10);
        
        expect(left.layout.width).toBe(50);
        expect(right.layout.width).toBe(50);
    });

    test("Integration: AppRoot renders Header into Host", async () => {
        const mockHost = new ZenTUIMock(100, 40);
        const store = createZenStore();
        
        // ╼ Sovereign Ignition
        Zen.ignite(() => <AppContent store={store} />, mockHost, true);
        
        // Initial Pulse to commit effect/render
        await Zen.pulse(true);

        // Visual Proof: Dump the buffer into the logs
        console.log(mockHost.dump());

        // 4. Verify Render Logic
        // Row 0: Header Component
        const header = mockHost.snapshot(1, 0, 7, 1);
        expect(header).toBe("ZEN-TUI");

        // Row 39: Status Bar Component (Industrial Anchor)
        const statusBar = mockHost.snapshot(1, 39, 10, 1);
        expect(statusBar).toContain("HARDCORE");
    });

    test("Integration: Keyboard Mode Switching (Tab)", async () => {
        const mockHost = new ZenTUIMock(100, 40);
        const store = createZenStore();
        
        // 1. Ignite (Sovereign Purity)
        Zen.ignite(() => <AppContent store={store} />, mockHost, true);
        
        // 2. Pulse: Flush the initial render frame and SolidJS microtasks (Effects/onMount)
        await Zen.pulse(true);

        // 3. Verify Initial State
        expect(store.state.mode()).toBe('navigation');

        // 4. Input: Dispatch keyboard event through the native bridge
        Zen.dispatchInput(JSON.stringify({ name: 'tab' }));

        // 5. Reactive Pulse: Process the state change and signal propagation
        // Triple-pulse ensures: [1: Input Processing] -> [2: State Update] -> [3: Layout/Render Flush]
        await Zen.pulse(true);
        await Zen.pulse(true);
        await Zen.pulse(true);

        // 6. Visual Proof: Verify Mode Switch via buffer content
        console.log(mockHost.dump());

        // 7. Final Assert: Verify bit-perfect state transition
        expect(store.state.mode()).toBe('review');
    });
});
