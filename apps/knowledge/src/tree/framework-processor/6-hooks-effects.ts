/**
 * 6. REACT EFFECTS ENGINE
 * 
 * Deconstructing how React schedules and flushes side effects (useEffect).
 */

import { Hook, Fiber } from "./5-hooks-engine";

// 1️⃣ Effect Data Structure
// Effects are stored in a circular linked list on the Fiber's updateQueue.
export type Effect = {
  tag: EffectTag;
  create: () => (() => void) | void;
  destroy: (() => void) | void;
  deps: any[] | null;
  next: Effect | null;
};

export enum EffectTag {
  NoFlags = 0b000,
  HasEffect = 0b001,
  Layout = 0b010,   // useLayoutEffect
  Passive = 0b100,  // useEffect
}

// 2️⃣ Fiber Extension for effects
export type FiberWithEffects = Fiber & {
  updateQueue: {
    lastEffect: Effect | null;
  } | null;
};

/**
 * 3️⃣ useEffect Implementation
 */
export function useEffect(create: () => void, deps?: any[]) {
  return mountEffect(EffectTag.Passive | EffectTag.HasEffect, create, deps);
}

/**
 * 4️⃣ useLayoutEffect Implementation
 */
export function useLayoutEffect(create: () => void, deps?: any[]) {
  return mountEffect(EffectTag.Layout | EffectTag.HasEffect, create, deps);
}

function mountEffect(tag: EffectTag, create: any, deps?: any[]) {
    console.log(`[Effects] Mounting effect with tag: ${tag}`);
    // In reality: 
    // 1. Get the current hook (as we did in 5-hooks-engine)
    // 2. Push the effect into the fiber's updateQueue
    const effect: Effect = {
        tag,
        create,
        destroy: undefined,
        deps: deps || null,
        next: null
    };
    return effect;
}

/**
 * 5️⃣ The Scheduler / Commit Phase (Conceptual)
 * 
 * After the render phase, React enters the commit phase 
 * where it flushes layout effects synchronously and 
 * schedules passive effects to run later.
 */
export function commitEffects(fiber: FiberWithEffects) {
  const queue = fiber.updateQueue;
  if (!queue || !queue.lastEffect) return;

  console.log(`[Commit] Flushing effects for fiber: ${fiber.id}`);
  
  // 1. Flush Layout Effects (Synchronous)
  // 2. Schedule Passive Effects (Asynchronous via MessageChannel/setTimeout)
}

/**
 * USAGE DEMO
 */
function EffectComponent() {
  useLayoutEffect(() => {
    console.log("[Effect] Layout effect running (DOM sync)");
  });

  useEffect(() => {
    console.log("[Effect] Passive effect running (Post-render)");
  }, []);

  return "Effect rendered";
}

if (require.main === module) {
  const fiber: FiberWithEffects = { 
    id: "effect-node", 
    memoizedState: null, 
    alternate: null,
    updateQueue: null 
  };
  
  console.log("--- Rendering component with effects ---");
  // Simulating the effect capturing during render
  const layout = useLayoutEffect(() => console.log("Layout sync"), []);
  const passive = useEffect(() => console.log("Passive async"), []);

  // Attach to mock queue
  const queue = { lastEffect: layout };
  layout.next = passive;
  passive.next = layout; // Circular list in React
  fiber.updateQueue = queue;

  console.log("\n--- Entering Commit Phase ---");
  commitEffects(fiber);
}
