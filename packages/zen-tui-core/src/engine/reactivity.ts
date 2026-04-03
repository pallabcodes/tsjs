/**
 * @zen-tui/core: ZenTUI ZenTUI Reactivity (Hardened Edition)
 * 
 * The Definitive Source of Truth for State Logic.
 */

import * as Solid from 'solid-js';

/**
 * 🧱 Zen: ZenTUI Reactivity Namespace
 */
export const Zen = {
    /** signal: Standard reactive read/write atom. */
    signal: Solid.createSignal,

    /** effect: Schedules a side-effect that tracks dependencies. */
    effect: Solid.createEffect,

    /** memo: Computes a value and caches it until dependencies change. */
    memo: Solid.createMemo,

    /** resource: Asynchronous state management for I/O. */
    resource: Solid.createResource,

    /** root: Creates an isolated reactive context for top-level mounting. */
    root: Solid.createRoot,

    /** batch: Combines multiple state updates into a single re-computation. */
    batch: Solid.batch,

    /** untrack: Prevents an block of code from tracking its dependencies. */
    untrack: Solid.untrack,

    /** onMount: Lifecycle hook for component initialization. */
    onMount: Solid.onMount,
    
    /** onCleanup: Lifecycle hook for component disposal. */
    onCleanup: Solid.onCleanup,

    /** context: Deep data propagation through the tree. */
    createContext: Solid.createContext,
    useContext: Solid.useContext,

    /**
     * ⚡ transition: High-performance TUI state interpolation.
     * 
     * Meaningfully animates values (e.g. opacity, width) over multiple
     * frames for visual transitions.
     */
    transition: <T extends number>(target: T, duration: number = 300): Solid.Accessor<number> => {
        const [current, setCurrent] = Solid.createSignal<number>(target);
        
        Solid.onMount(() => {
            const start = current();
            const change = target - start;
            const startTime = Date.now();

            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Linear Easing
                const val = start + (change * progress);
                setCurrent(val as any); // Cast for industrial frame interpolation

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            requestAnimationFrame(animate);
        });

        return current;
    }
};

// 2. Direct Typed Re-exports (Industrial Standard)
export {
    createSignal,
    createEffect,
    createMemo,
    createResource,
    createRoot,
    batch,
    untrack,
    onMount,
    onCleanup,
    createContext,
    useContext
} from 'solid-js';

export { 
    splitProps,
    Show,
    For,
    Index,
    Switch,
    Match,
    Suspense
} from 'solid-js';
