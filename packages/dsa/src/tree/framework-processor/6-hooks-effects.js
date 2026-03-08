"use strict";
/**
 * 6. REACT EFFECTS ENGINE
 *
 * Deconstructing how React schedules and flushes side effects (useEffect).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EffectTag = void 0;
exports.useEffect = useEffect;
exports.useLayoutEffect = useLayoutEffect;
exports.commitEffects = commitEffects;
var EffectTag;
(function (EffectTag) {
    EffectTag[EffectTag["NoFlags"] = 0] = "NoFlags";
    EffectTag[EffectTag["HasEffect"] = 1] = "HasEffect";
    EffectTag[EffectTag["Layout"] = 2] = "Layout";
    EffectTag[EffectTag["Passive"] = 4] = "Passive";
})(EffectTag || (exports.EffectTag = EffectTag = {}));
/**
 * 3️⃣ useEffect Implementation
 */
function useEffect(create, deps) {
    return mountEffect(EffectTag.Passive | EffectTag.HasEffect, create, deps);
}
/**
 * 4️⃣ useLayoutEffect Implementation
 */
function useLayoutEffect(create, deps) {
    return mountEffect(EffectTag.Layout | EffectTag.HasEffect, create, deps);
}
function mountEffect(tag, create, deps) {
    console.log(`[Effects] Mounting effect with tag: ${tag}`);
    // In reality: 
    // 1. Get the current hook (as we did in 5-hooks-engine)
    // 2. Push the effect into the fiber's updateQueue
    const effect = {
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
function commitEffects(fiber) {
    const queue = fiber.updateQueue;
    if (!queue || !queue.lastEffect)
        return;
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
    const fiber = {
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
//# sourceMappingURL=6-hooks-effects.js.map