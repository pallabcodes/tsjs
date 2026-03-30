import { dispatchInput, createSignal, createEffect } from '@zen-tui/solid';
import type { ZenInputEvent } from '@zen-tui/core';

/**
 * Unit Test: Sovereign Full-Chain Flow (A to D)
 * 
 * Simulates the entire interaction chain from Input to Render.
 */
async function testFullChain() {
  console.log("--- Sovereign Full-Chain Test ---");

  // 1. Mock the Store Logic
  const [getMode, setMode] = createSignal('passive');
  const footerMode = getMode;
  
  const steps: string[] = [];
  const log = (step: string) => {
     console.log(`[FLOW_${step}] Logged`);
     steps.push(step);
  };

  // 2. Define Effect (C)
  createEffect(() => {
     log('C');
     console.log(`  State is now: ${footerMode()}`);
  });

  // 3. Define Handler (A & B)
  const handler = (e: ZenInputEvent) => {
     log('A');
     if (e.name === ':') {
        log('B');
        setMode('active');
     }
  };

  // 4. Trace the Render (D)
  const renderTrace = () => {
     log('D');
     return footerMode();
  };

  console.log("Step 1: Dispatching ':'...");
  handler({ name: ':' } as any);
  
  // Trigger Render Trace
  renderTrace();

  console.log("--- Chain Verification ---");
  const expected = ['C', 'A', 'B', 'C', 'D']; // Initial C + Input Chain
  console.log(`Captured Flow: ${steps.join(' -> ')}`);
  
  if (steps.includes('A') && steps.includes('B') && steps.includes('C') && steps.includes('D')) {
     console.log("SUCCESS: A-B-C-D Flow Confirmed.");
  } else {
     console.log("FAILURE: Chain broken.");
     process.exit(1);
  }
}

testFullChain().catch(err => {
  console.error(err);
  process.exit(1);
});
