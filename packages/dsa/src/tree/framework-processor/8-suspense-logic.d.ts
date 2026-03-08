/**
 * 8. REACT SUSPENSE & ERROR BOUNDARIES
 *
 * Deconstructing the "unwind" phase: how React catches promises
 * and errors to show Fallbacks or Error UI.
 */
import { Fiber } from "./5-hooks-engine";
export declare const SuspenseTag = 13;
export declare const ErrorBoundaryTag = 4;
/**
 * 2️⃣ The "Throwing Promises" Pattern
 *
 * When a component calls a resource that isn't ready, it throws
 * a promise. React catches this in a try-catch block wrapping 'render'.
 */
export declare function renderComponent(wip: Fiber, Component: any): any;
