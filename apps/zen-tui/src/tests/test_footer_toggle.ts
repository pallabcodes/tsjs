import { createZenStore } from '../app/store/ZenStore.js';

async function testFooterToggle() {
  console.log("--- L5 Dashboard: Pure Store Footer Toggle Unit Test ---");

  // Spin up a perfectly isolated identical replica of the store for Headless testing
  const [state, dispatch] = createZenStore();
  const modeHistory: string[] = [];

  const checkState = () => {
    const currentMode = state.mode();
    console.log(`[STATE_CHANGE] Footer mode is now: '${currentMode}'`);
    modeHistory.push(currentMode);
  };

  console.log("\n[TEST] 1. Initial State");
  checkState();

  if (state.mode() !== 'passive') {
    throw new Error("Expected initial mode to be 'passive'");
  }

  console.log("\n[TEST] 2. Dispatched Key: 'space'");
  dispatch({ type: 'KEY_PRESS', key: 'space' });
  checkState();
 
  if (state.mode() !== 'active') {
    throw new Error("Expected mode to switch to 'active' on Space");
  }

  console.log("\n[TEST] 3. Dispatched Key: 'ctrl+backtick'");
  dispatch({ type: 'SET_MODE', mode: 'passive' }); // Reset for next test
  dispatch({ type: 'KEY_PRESS', key: 'ctrl+backtick' });
  checkState();
  
  if (state.mode() !== 'active') {
    throw new Error("Expected mode to switch to 'active' on Ctrl+` ");
  }

  console.log("\n[TEST] 4. Dispatched Key: 'escape'");
  dispatch({ type: 'KEY_PRESS', key: 'escape' });
  checkState();

  if (state.mode() !== 'passive') {
    throw new Error("Expected mode to revert to 'passive'");
  }

  console.log("\n--- Verification Complete ---");
  const expectedHistory = ['passive', 'active', 'active', 'passive'];
  console.log(`Captured State Flow: [${modeHistory.join(' -> ')}]`);
  
  if (JSON.stringify(modeHistory) === JSON.stringify(expectedHistory)) {
    console.log("✅ SUCCESS: Footer toggle logic and pure Redux-style Reducers are perfectly isolated and testable.");
  } else {
    console.error("❌ FAILURE: State flow did not match expected transitions.");
    process.exit(1);
  }
}

testFooterToggle().catch(err => {
  console.error("Test failed with exception:", err);
  process.exit(1);
});
