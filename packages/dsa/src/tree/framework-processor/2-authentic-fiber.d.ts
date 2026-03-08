/**
 * 2. AUTHENTIC FIBER ENGINE
 *
 * Implements the beginWork / completeWork cycle.
 * Focuses on reconciliation logic and side-effect tracking.
 * Fixed: Nullable types for strict null checks.
 */
export type EffectTag = "PLACEMENT" | "UPDATE" | "DELETION" | "NONE";
export type Fiber = {
    type: string;
    id: string;
    props: Record<string, any>;
    child?: Fiber | null;
    sibling?: Fiber | null;
    return?: Fiber | null;
    alternate?: Fiber | null;
    effectTag?: EffectTag;
    stateNode?: any;
};
export declare class Reconciler {
    private scheduleCallback;
    private host;
    private wipRoot;
    private currentRoot;
    private deletions;
    constructor(scheduleCallback: (work: () => void) => void);
    render(element: any): void;
    performUnitOfWork(fiber: Fiber): Fiber | null;
    private reconcileChildren;
    private commitRoot;
    private commitWork;
}
