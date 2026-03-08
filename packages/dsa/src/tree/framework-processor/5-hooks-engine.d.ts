/**
 * 5. REACT HOOKS ENGINE
 *
 * Deconstructing how React maintains state across renders using a
 * linked list of "Hooks" attached to the Fiber node.
 */
export type Hook = {
    memoizedState: any;
    next: Hook | null;
    queue: {
        pending: Update | null;
    } | null;
};
type Update = {
    action: any;
    next: Update | null;
};
export type Fiber = {
    id: string;
    memoizedState: Hook | null;
    alternate: Fiber | null;
    child?: Fiber | null;
    sibling?: Fiber | null;
    return?: Fiber | null;
};
export declare function renderWithHooks(wip: Fiber, Component: (props: any) => any, props: any): any;
/**
 * 4️⃣ useState Implementation
 */
export declare function useState<T>(initialState: T): [T, (action: any) => void];
/**
 * 5️⃣ useReducer Implementation (The core hook logic)
 */
export declare function useReducer<S, I>(reducer: (state: S, action: any) => S, initialArg: I): [S, (action: any) => void];
export {};
