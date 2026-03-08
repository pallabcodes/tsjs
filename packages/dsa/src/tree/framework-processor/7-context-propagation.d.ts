/**
 * 7. REACT CONTEXT PROPAGATION
 *
 * Deconstructing how React propagates context changes without
 * having to re-render every component in between.
 */
export type Context<T> = {
    _currentValue: T;
    Provider: {
        _context: Context<T>;
    };
};
export declare function createContext<T>(defaultValue: T): Context<T>;
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
export declare function propagateContextChange(workInProgress: Fiber, context: Context<any>, changedBits: number): void;
/**
 * 3️⃣ useContext Implementation
 */
export declare function useContext<T>(context: Context<T>): T;
