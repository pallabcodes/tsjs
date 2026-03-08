/**
 * 3. REACT SCHEDULER & LANES SYSTEM
 *
 * An advanced implementation that prioritizes updates using bitmask lanes.
 * Architecture: Fiber Reconciler + Lane-aware Scheduler + Two-Phase Commit.
 */
export type Lane = number;
export declare const NoLane = 0;
export declare const SyncLane = 1;
export declare const InputLane = 2;
export declare const DefaultLane = 4;
export declare const TransitionLane = 8;
export declare const IdleLane = 16;
export declare function getHighestPriorityLane(lanes: number): Lane;
export type EffectTag = "PLACEMENT" | "UPDATE" | "DELETION" | "NONE";
export type Fiber = {
    id: string;
    type: string;
    props: any;
    child: Fiber | null;
    sibling: Fiber | null;
    return: Fiber | null;
    alternate: Fiber | null;
    effectTag: EffectTag;
    lane: Lane;
};
export declare class Scheduler {
    private reconciler;
    private pendingLanes;
    private nextUnitOfWork;
    private deadline;
    private frameTime;
    constructor(reconciler: FiberReconciler);
    scheduleUpdate(root: Fiber, lane: Lane): void;
    private workLoopConcurrent;
}
export declare class FiberReconciler {
    private currentRoot;
    private wipRoot;
    performUnitOfWork(unitOfWork: Fiber, lane: Lane): Fiber | null;
    private reconcileChildren;
    commitRoot(): void;
    private commitWork;
}
