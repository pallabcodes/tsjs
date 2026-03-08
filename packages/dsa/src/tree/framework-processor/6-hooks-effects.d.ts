/**
 * 6. REACT EFFECTS ENGINE
 *
 * Deconstructing how React schedules and flushes side effects (useEffect).
 */
import { Fiber } from "./5-hooks-engine";
export type Effect = {
    tag: EffectTag;
    create: () => (() => void) | void;
    destroy: (() => void) | void;
    deps: any[] | null;
    next: Effect | null;
};
export declare enum EffectTag {
    NoFlags = 0,
    HasEffect = 1,
    Layout = 2,// useLayoutEffect
    Passive = 4
}
export type FiberWithEffects = Fiber & {
    updateQueue: {
        lastEffect: Effect | null;
    } | null;
};
/**
 * 3️⃣ useEffect Implementation
 */
export declare function useEffect(create: () => void, deps?: any[]): Effect;
/**
 * 4️⃣ useLayoutEffect Implementation
 */
export declare function useLayoutEffect(create: () => void, deps?: any[]): Effect;
/**
 * 5️⃣ The Scheduler / Commit Phase (Conceptual)
 *
 * After the render phase, React enters the commit phase
 * where it flushes layout effects synchronously and
 * schedules passive effects to run later.
 */
export declare function commitEffects(fiber: FiberWithEffects): void;
