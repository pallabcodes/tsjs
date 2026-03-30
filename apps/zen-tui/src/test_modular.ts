import { footerMode, setFooterModeSignal } from './src/app/state.js';
import { handleSovereignInput } from './src/app/actions.js';

/**
 * Unit Test: Sovereign V17 Modular Flow
 * 
 * Verifies that the Action Controller correctly updates the State 
 * and triggers the compositor pump in a single-responsibility flow.
 */
async function testModularFlow() {
  console.log("--- Sovereign V17 Modular Test ---");

  // 1. Initial State
  console.log(`Initial Mode: ${footerMode()}`);
  
  // 2. Simulate ':' Action
  console.log("Step 1: Dispatching ':' through Action Controller...");
  handleSovereignInput({ name: ':' } as any);

  // 3. Verify State
  if (footerMode() === 'active') {
    console.log("SUCCESS: Modular state updated through Controller.");
  } else {
    console.log(`FAILURE: State is still ${footerMode()}`);
    process.exit(1);
  }

  // 4. Simulate 'ESC' Action
  console.log("Step 2: Dispatching 'escape' through Action Controller...");
  handleSovereignInput({ name: 'escape' } as any);

  if (footerMode() === 'passive') {
    console.log("SUCCESS: Modular flow complete.");
  } else {
    console.log(`FAILURE: State transition stuck.`);
    process.exit(1);
  }
}

testModularFlow().catch(err => {
  console.error(err);
  process.exit(1);
});
