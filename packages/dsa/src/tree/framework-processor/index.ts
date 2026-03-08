/**
 * FRAMEWORK PROCESSOR PROGRESSION
 * 
 * This module demonstrates the evolution of a modern UI processing engine
 * through three distinct stages of complexity.
 * 
 * 1. Basic Hybrid (Walker + Iterator + Scheduler)
 *    - Simplest model of time-slicing and iterative DFS.
 *    - See: ./1-basic-hybrid.ts
 * 
 * 2. Authentic Fiber (Reconciler + beginWork/completeWork)
 *    - Implements the React-internal traversal model and reconciliation.
 *    - See: ./2-authentic-fiber.ts
 * 
 * 3. Scheduler & Lanes (Prioritization + Bitmasks)
 *    - The most advanced model incorporating high-fidelity priority management.
 *    - See: ./3-scheduler-lanes.ts
 * 
 * 4. Keyed Reconciliation (O(n) Diffing)
 *    - Implements list reconciliation with move detection.
 *    - See: ./4-keyed-reconciliation.ts
 */

export * as Stage1 from './1-basic-hybrid';
export * as Stage2 from './2-authentic-fiber';
export * as Stage3 from './3-scheduler-lanes';
export * as Stage4 from './4-keyed-reconciliation';

console.log("Framework Processor Progression Loaded.");
console.log("Explore 1-basic-hybrid.ts through 4-keyed-reconciliation.ts for detailed logic.");
