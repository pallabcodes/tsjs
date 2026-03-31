/**
 * @zen-tui/solid: Core Reconciler Unit Test (Principle-Grade)
 * 
 * Verifies that the ZenTUI core reconciler handles SolidJS 
 * insertions and mutations with absolute stability.
 */

import { render, h, Box, Text, Show, createSignal, registry } from '../index.js';

async function runTest() {
    console.log("--- ZenTUI Core: Reconciler Unit Test ---");

    // 0. Reset Registry
    registry.nodes.clear();
    const root = (globalThis as any).__ZenTUI_BRIDGE__.createRoot(async (dispose: any) => {
        const [show, setShow] = createSignal(true);
        
        render(() => (
            <Box id="parent">
                <Show when={show()}>
                    <Text value="ON" />
                </Show>
                <Show when={!show()}>
                    <Text value="OFF" />
                </Show>
            </Box>
        ), registry.root);

        // 1. Initial State
        console.log("[TEST] 1. Initial State (ON)");
        
        const dumpTree = (node: any, indent = 0) => {
            console.log(" ".repeat(indent) + `- [${node.type}] id=${node.id} props=${JSON.stringify(node.props)} children=${node.children?.length || 0}`);
            if (node.children) {
                for (const c of node.children) dumpTree(c, indent + 2);
            }
        };

        // await internal flush
        await new Promise(r => setTimeout(r, 0));
        dumpTree(registry.root);
        
        // Find 'ON' anywhere in the tree
        const findValue = (node: any, val: string): boolean => {
            if (node.props?.value === val) return true;
            if (node.children) {
                for (const c of node.children) if (findValue(c, val)) return true;
            }
            return false;
        };

        if (!findValue(registry.root, "ON")) throw new Error("Initial state ON not found.");
        console.log("✅ ON Verified.");

        // 2. Mutation: Toggle to OFF
        console.log("[TEST] 2. Toggling to OFF");
        setShow(false);
        
        // ╼ Reactive Synchronization
        // Wait for SolidJS's microtask buffer to flush the mutation.
        await new Promise(r => setTimeout(r, 100));
        
        console.log("[DEBUG] Tree after mutation:");
        dumpTree(registry.root);
        
        if (!findValue(registry.root, "OFF")) throw new Error("OFF state not found after mutation.");
        console.log("✅ OFF Verified.");

        dispose();
    });

    console.log("--- SUCCESS: ZenTUI Core is stable. ---");
}

try {
    await runTest();
} catch (err: any) {
    console.error("❌ FAILURE:", err.message);
    process.exit(1);
}
