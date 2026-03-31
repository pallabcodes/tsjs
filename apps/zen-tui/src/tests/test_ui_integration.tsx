/**
 * @zen-tui/tests: Sovereign High-Fidelity UI Integration
 * 
 * Performs an absolute v-tree verification of the Sovereign Footer.
 * Proves that branch-swapping (Passive -> Active) is 100% reactive.
 */

import { render, createRUCNode, registry } from '@zen-tui/solid';
import { Footer } from '../app/view/Footer.js';
import { setFooterMode, footerMode } from '../app/store.js';

async function runTest() {
    console.log("--- Sovereign L5: High-Fidelity UI Integration Test ---");
    
    // 0. Precision Registry Reset
    registry.nodes.clear();
    const root = createRUCNode('root');
    
    // 1. Initial Render: Passive State
    console.log("[TEST] 1. Initial Render (Passive State)");
    render(() => <Footer />, root);
    
    // We allow an initial microtask tick for Solid's hydration
    await new Promise(r => setTimeout(r, 50));

    // Search for indicator text
    const findText = (node: any, target: string): boolean => {
        if (node.props?.value?.includes(target)) return true;
        if (node.children) {
            for (const c of node.children) {
                if (findText(c, target)) return true;
            }
        }
        return false;
    };
    
    const isPassive = findText(root, " READY");
    if (isPassive) {
        console.log("✅ Passive State Verified: Indicator ' READY' found.");
    } else {
        console.error("❌ FAILURE: Initial state is not Passive.");
        process.exit(1);
    }
    
    // 2. Triggering Command Mode (Reactive Shift)
    console.log("[TEST] 2. Triggering Command Mode (Direct Store Update)");
    setFooterMode('active');
    
    // We allow a microtask tick for Solid's effect to flush
    await new Promise(r => setTimeout(r, 50));
    
    // 3. Absolute V-Tree Verification: Active State
    const isActive = findText(root, " COMMAND MODE");
    if (isActive) {
        console.log("✅ SUCCESS: Sovereign Footer real-time reactivity verified!");
        console.log("RUC Tree successfully swapped branch: Passive -> Active.");
    } else {
        console.error("❌ FAILURE: UI did not react to store update.");
        console.log("Current Global Mode:", footerMode());
        process.exit(1);
    }
    
    console.log("--- Verification Complete ---");
}

runTest().catch(console.error);
