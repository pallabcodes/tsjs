import { expect, test, describe, beforeEach } from "bun:test";
import { createZenStore } from '../app/state/ZenStore.tsx';
import { 
  Zen,
} from '@zen-tui/core';
import { ZenTUIMock } from '../../../../packages/zen-tui-core/src/tests/ZenTUIMock';

describe("ZenTUI: ZenStore Verification", () => {
    let mockHost: ZenTUIMock;
    
    beforeEach(() => {
        Zen.terminate();
        // ╼ Sovereign Ignition for Unit Verification
        mockHost = new ZenTUIMock(100, 40);
        Zen.ignite(() => ({} as any), mockHost, true);
    });

    test("ZenStore: Initial Repository Sync", async () => {
        const { state } = createZenStore();
        
        // ╼ Sovereign Pulse to reify initial sync
        await Zen.pulse(true);

        // Initial state should match mockHost baseline (3 commits)
        expect(state.commits().length).toBeGreaterThan(0);
    });

    test("ZenStore: Deterministic Navigation", async () => {
        const { state, dispatch } = createZenStore();
        
        await Zen.pulse(true); // Reify sync

        expect(state.selectedIndex()).toBe(0);
        dispatch({ type: 'MOVE_SELECTION', direction: 'down' });
        
        await Zen.pulse(true); // Reify state update
        expect(state.selectedIndex()).toBe(1);
    });

    test("ZenStore: Git Stage Lifecycle", () => {
        let stagedPath = "";
        mockHost.stageFile = (path: string) => { stagedPath = path; };

        const { dispatch } = createZenStore();
        dispatch({ type: 'STAGE_FILE', path: 'dirty.rs' });

        expect(stagedPath).toBe('dirty.rs');
    });

    test("ZenStore: Mode Switching", () => {
        const { state, dispatch } = createZenStore();
        
        expect(state.mode()).toBe('navigation');
        dispatch({ type: 'SET_MODE', mode: 'command' });
        expect(state.mode()).toBe('command');
    });
});
