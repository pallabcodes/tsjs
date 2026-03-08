/**
 * 5. REACT HOOKS ENGINE
 * 
 * Deconstructing how React maintains state across renders using a 
 * linked list of "Hooks" attached to the Fiber node.
 */

// 1️⃣ Hook Data Structure
export type Hook = {
  memoizedState: any;    // The current state or reducer value
  next: Hook | null;     // Pointer to the next hook in the list
  queue: {
    pending: Update | null;
  } | null;
};

type Update = {
  action: any;
  next: Update | null;
};

// 2️⃣ Fiber Extension
// In a real reconciler, the Fiber node holds the head of the hooks list.
export type Fiber = {
  id: string;
  memoizedState: Hook | null; // Head of the hooks linked list
  alternate: Fiber | null;
  child?: Fiber | null;
  sibling?: Fiber | null;
  return?: Fiber | null;
};

/**
 * 3️⃣ The Hooks Dispatcher (Global Context)
 */
let currentlyRenderingFiber: Fiber | null = null;
let workInProgressHook: Hook | null = null;
let currentHook: Hook | null = null;

export function renderWithHooks(wip: Fiber, Component: (props: any) => any, props: any) {
  currentlyRenderingFiber = wip;
  currentlyRenderingFiber.memoizedState = null; // Reset for this render-pass in simplified model
  workInProgressHook = null;
  
  // In reality, currentHook would point to wip.alternate.memoizedState
  currentHook = wip.alternate ? wip.alternate.memoizedState : null;

  const children = Component(props);

  currentlyRenderingFiber = null;
  workInProgressHook = null;
  currentHook = null;

  return children;
}

/**
 * 4️⃣ useState Implementation
 */
export function useState<T>(initialState: T): [T, (action: any) => void] {
  return useReducer(basicStateReducer, initialState);
}

function basicStateReducer(state: any, action: any) {
  return typeof action === "function" ? action(state) : action;
}

/**
 * 5️⃣ useReducer Implementation (The core hook logic)
 */
export function useReducer<S, I>(
  reducer: (state: S, action: any) => S,
  initialArg: I
): [S, (action: any) => void] {
  if (!currentlyRenderingFiber) {
    throw new Error("Hooks can only be called inside a component!");
  }

  const hook = updateWorkInProgressHook();

  if (currentlyRenderingFiber.alternate === null) {
    // Mount phase
    hook.memoizedState = initialArg;
  }

  const dispatch = (action: any) => {
    console.log(`[Hooks] Dispatching action for hook on fiber: ${currentlyRenderingFiber?.id}`);
    // In reality, this would:
    // 1. Create an update object
    // 2. Add to hook.queue.pending
    // 3. Trigger a re-render on the Fiber root
    hook.memoizedState = reducer(hook.memoizedState, action);
  };

  return [hook.memoizedState, dispatch];
}

/**
 * 6️⃣ Hook List Management
 * This is why the ORDER of hooks matters!
 */
function updateWorkInProgressHook(): Hook {
  let hook: Hook;

  if (workInProgressHook === null) {
    // This is the first hook in the list
    if (currentlyRenderingFiber!.memoizedState === null) {
      hook = { memoizedState: null, next: null, queue: null };
      currentlyRenderingFiber!.memoizedState = hook;
    } else {
      hook = currentlyRenderingFiber!.memoizedState;
    }
    workInProgressHook = hook;
  } else {
    // Subsequent hooks
    if (workInProgressHook.next === null) {
      hook = { memoizedState: null, next: null, queue: null };
      workInProgressHook.next = hook;
    } else {
      hook = workInProgressHook.next;
    }
    workInProgressHook = hook;
  }

  return workInProgressHook;
}

/**
 * USAGE DEMO
 */
function Counter() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("Hello");

  console.log(`[Counter] Render: count=${count}, text="${text}"`);
  
  return { count, text, setCount, setText };
}

if (require.main === module) {
  const fiber: Fiber = { id: "counter-node", memoizedState: null, alternate: null };
  
  console.log("--- Initial Render ---");
  let instance = renderWithHooks(fiber, Counter, {});

  console.log("\n--- Simulating Update (setCount(1)) ---");
  instance.setCount(1);
  
  // Note: For the update to "stick" in this simplified model, 
  // we would normally trigger another renderWithHooks with the modified fiber.
  instance = renderWithHooks(fiber, Counter, {});

  console.log("\n--- Simulating Update (setText('World')) ---");
  instance.setText("World");
  instance = renderWithHooks(fiber, Counter, {});
}
