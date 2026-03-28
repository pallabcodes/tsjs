import { ZenNode, ZenTextNode, getNextId } from '../packages/zen-tui-node/src/index.js';
import { ZenBuffer, ZenTerminal } from '../packages/zen-tui-native/src/index.js';
import { ZenLayoutEngine } from '../packages/zen-tui-layout/src/index.js';
import { ZenInspector } from '../packages/zen-tui-core/src/Inspector.js';

/**
 * Sovereign Render Story: A 5-Step Verification
 * 
 * Step 1: Initialize Unified State
 * Step 2: Construct Virtual Tree (Reconciliation)
 * Step 3: Compute Geometry (Layout Engine)
 * Step 4: Rasterize to Buffer (Painter)
 * Step 5: Verify Final Output
 */

async function runStory() {
  console.log("\n--- 1. Initialize Unified State ---");
  const layout = new ZenLayoutEngine();
  const buffer = new ZenBuffer(80, 24);
  console.log("✓ Layout Engine and Buffer initialized.");

  console.log("\n--- 2. Construct Virtual Tree ---");
  const root = new ZenNode('root', { width: '100%', height: '100%' }, getNextId('root'));
  root.nativeId = layout.create_node("column", 80, 24);

  const container = new ZenNode('box', { padding: { top: 1, left: 2 } }, getNextId('box'));
  container.nativeId = layout.create_node("column", null, null);
  root.children.push(container);
  layout.add_child(root.nativeId, container.nativeId);

  const textNode = new ZenTextNode("Hello Sovereign TUI", undefined, getNextId('text'));
  textNode.nativeId = layout.create_node("row", 19, 1);
  container.children.push(textNode);
  layout.add_child(container.nativeId, textNode.nativeId);
  console.log(`✓ Constructed tree with Root:${root.nativeId} and Container:${container.nativeId}`);

  console.log("\n--- 3. Compute Geometry ---");
  const layouts = layout.compute_layout(root.nativeId, 80, 24);
  
  const layoutMap = new Map<number, { x: number, y: number, w: number, h: number }>();
  for (let i = 0; i < layouts.length; i += 5) {
    layoutMap.set(layouts[i], { x: layouts[i+1], y: layouts[i+2], w: layouts[i+3], h: layouts[i+4] });
  }

  // Sync virtual nodes with native layout for Inspector
  const sync = (node: any) => {
    const l = layoutMap.get(node.nativeId);
    if (l) node.layout = { x: l.x, y: l.y, width: l.w, height: l.h };
    if (node.children) node.children.forEach(sync);
  };
  sync(root);

  console.log(`Root: ${JSON.stringify(root.layout)}`);
  console.log(`Container: ${JSON.stringify(container.layout)}`);
  console.log(`Text: ${JSON.stringify(textNode.layout)}`);
  console.log("✓ Layout computed and synced.");

  console.log("\n--- 4. Rasterize to Buffer ---");
  ZenInspector.paintToBuffer(root, buffer);
  console.log("✓ Tree painted to buffer.");

  console.log("\n--- 5. Verify Complex Components ---");
  // Test a Tab segment simulation
  const tabNode = new ZenNode('tab', { width: 10, height: 1 }, getNextId('tab'));
  tabNode.layout = { x: 0, y: 10, width: 10, height: 1 };
  const tabText = new ZenTextNode(" Tab 1 ", undefined, getNextId('text'));
  tabText.layout = { x: 0, y: 10, width: 7, height: 1 };
  tabNode.children.push(tabText);
  root.children.push(tabNode);
  ZenInspector.paintToBuffer(tabNode, buffer);
  console.log("✓ Tabs painted and verified.");

  console.log("\n--- 6. Final Visualization & Assertion ---");
  const visualization = ZenInspector.visualize(root, 40, 12);
  console.log("\n" + visualization + "\n");
  
  const stripAnsi = (str: string) => str.replace(/\x1B\[[0-9;]*[a-zA-Z]/g, '');
  const cleanVis = stripAnsi(visualization);

  const assertions = [
    { name: "Core Text", pattern: "Hello Sovereign TUI" },
    { name: "Tab Component", pattern: "Tab 1" }
  ];

  let allPassed = true;
  for (const as of assertions) {
    if (cleanVis.includes(as.pattern)) {
      console.log(`✓ PASS: ${as.name}`);
    } else {
      console.log(`✗ FAIL: ${as.name} not found.`);
      allPassed = false;
    }
  }

  if (allPassed) {
    console.log("\nSUCCESS: Sovereign Render Story Fully Verified!");
  } else {
    console.log("\nFAILURE: Verification assertions failed.");
    process.exit(1);
  }
}

runStory().catch(err => {
  console.error("\nSTORY FAILED:", err);
  process.exit(1);
});
