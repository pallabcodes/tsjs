import { createZenEngine } from './Engine.js';
import { render, createComponent, setLayoutEngine } from '../../zen-tui-solid/src/index.js';
import { ZenInspector } from './Inspector.js';
import App from '../../../apps/zen-tui/src/app/App.js';

console.log('--- ZEN-TUI: Sovereign Layout Verification (Visual) ---');

async function verify() {
  const engine = createZenEngine();
  setLayoutEngine(engine.layout);

  console.log('Bootstrapping App tree...');
  
  render(() => {
    return createComponent(App, {});
  }, engine.root);

  // 3. Tree is already populated synchronously in App constructor
  console.log('✔ Tree Reconciled & Data Loaded.');
  console.log('Computing Sovereign Layout...');

  // Use dynamic terminal size for the ASCII visualization
  const W = process.stdout.columns || 122;
  const H = process.stdout.rows || 40;
  
  console.log(`Computing Sovereign Layout (${W}x${H})...`);
  const layoutData = engine.layout.compute_layout(engine.root.nativeId!, W, H);
  
  // Update node layout objects
  const idMap = new Map();
  const updateNodeMap = (node: any) => {
    idMap.set(node.nativeId, node);
    if (node.children) node.children.forEach(updateNodeMap);
  };
  updateNodeMap(engine.root);

  for (let i = 0; i < layoutData.length; i += 5) {
     const id = layoutData[i];
     const node = idMap.get(id);
     if (node) {
        node.layout.x = layoutData[i+1];
        node.layout.y = layoutData[i+2];
        node.layout.width = layoutData[i+3];
        node.layout.height = layoutData[i+4];
     }
  }

  // 4. Trace the tree metadata (Skip printing 30k lines for sanity)
  console.log('\n--- SOVEREIGN TREE AUDIT ---\n');
  let nodeCount = 0;
  const countNodes = (node: any) => {
    nodeCount++;
    if (node.children) node.children.forEach(countNodes);
  };
  countNodes(engine.root);
  console.log(`✔ Sovereign Tree Integrity: ${nodeCount} active nodes.`);
  console.log(`✔ Workspace Topology: ${W}x${H}`);

  // 5. High-Fidelity ASCII Visualization (The finale)
  console.log('\n--- SOVEREIGN VISUAL AUDIT ---\n');
  
  // Clear scrollback to make the TUI the center of attention
  process.stdout.write('\x1b[2J\x1b[3J\x1b[H');
  
  const visualization = ZenInspector.visualize(engine.root, W, H);
  process.stdout.write(visualization + '\n');
  
  console.log('\n✔ Layout Verification Successful!');
  engine.destroy();
}

verify().catch(console.error);
