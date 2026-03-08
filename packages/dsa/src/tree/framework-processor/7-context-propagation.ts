/**
 * 7. REACT CONTEXT PROPAGATION
 * 
 * Deconstructing how React propagates context changes without 
 * having to re-render every component in between.
 */

// 1️⃣ Context Data Structure
export type Context<T> = {
  _currentValue: T;
  Provider: {
    _context: Context<T>;
  };
};

export function createContext<T>(defaultValue: T): Context<T> {
  const context: Context<T> = {
    _currentValue: defaultValue,
    Provider: null as any,
  };
  context.Provider = { _context: context };
  return context;
}

/**
 * 2️⃣ The Propagation Strategy
 * 
 * When a Provider value changes, React performs a depth-first search 
 * from the Provider's fiber node to find all Consumers.
 */
import { Fiber } from "./5-hooks-engine";

export type ContextConsumerFiber = Fiber & {
  dependencies: {
    context: Context<any>;
    next: any;
  } | null;
};

export function propagateContextChange(
  workInProgress: Fiber,
  context: Context<any>,
  changedBits: number
) {
  console.log(`[Context] Propagating change for context to children of: ${workInProgress.id}`);
  
  let fiber = workInProgress.child;
  while (fiber) {
    // 1. Check if this fiber depends on this context
    // 2. If yes, schedule an update on this fiber
    // 3. Continue searching siblings and children
    fiber = fiber.sibling;
  }
}

/**
 * 3️⃣ useContext Implementation
 */
export function useContext<T>(context: Context<T>): T {
  console.log(`[Context] useContext called for value: ${context._currentValue}`);
  // In reality, this adds the context to the current fiber's 'dependencies' list.
  return context._currentValue;
}

/**
 * USAGE DEMO
 */
const UserContext = createContext({ name: "Guest" });

function App() {
  console.log("[App] Rendering Provider with 'Alice'");
  UserContext._currentValue = { name: "Alice" }; // Mocking Provider value change
}

function Child() {
  const user = useContext(UserContext);
  console.log(`[Child] Received Context: ${user.name}`);
}

if (require.main === module) {
  console.log("--- Initial Context Access ---");
  Child();

  console.log("\n--- Simulating Provider Update ---");
  App();
  
  console.log("\n--- Child re-accessing context ---");
  Child();
}
