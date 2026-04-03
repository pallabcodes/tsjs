import { expect, test, describe, beforeEach } from "bun:test";
import { render, registry, createRoot, Theme, type ZenNode } from '@zentui/core';
import App from '../app/App';

/**
 * ZenTUI: Structural Integration Verification (Final)
 */
describe("ZenTUI: Structural Integration (Final)", () => {
    
    beforeEach(() => {
        // Clear the industrial registry for test isolation
        const children = [...registry.root.children];
        for (const child of children) {
            registry.root.removeChild(child);
        }
    });

    /** Utility: Find nodes by type and criteria */
    function findNode(node: ZenNode, predicate: (n: ZenNode) => boolean): ZenNode | undefined {
        if (predicate(node)) return node;
        for (const child of node.children) {
            const found = findNode(child, predicate);
            if (found) return found;
        }
        return undefined;
    }

    test("Root App defines partition hierarchy", () => {
        createRoot((dispose) => {
            render(() => <App />, registry.root);

            expect(registry.root.children.length).toBe(1);
            const appContainer = registry.root.children[0];
            
            // Search for the industrial Status.Bar structure
            const statusBar = findNode(registry.root, n => n.props.bg === Theme.Colors.PanelActive && n.props.height === 1);
            expect(statusBar).toBeDefined();

            // Search for the Main Grid
            const grid = findNode(registry.root, n => n.props.flexDirection === 'row' && n.props.width === '100%');
            expect(grid).toBeDefined();

            dispose();
        });
    });

    test("Layout: Pane structure verification", () => {
        createRoot((dispose) => {
            render(() => <App />, registry.root);

            // Find an active Pane with the sovereign Border color
            const activePane = findNode(registry.root, n => n.props.borderColor === Theme.Colors.BorderActive);
            expect(activePane).toBeDefined();
            
            dispose();
        });
    });

});
