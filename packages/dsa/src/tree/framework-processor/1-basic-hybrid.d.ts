/**
 * 1. BASIC HYBRID PROCESSOR
 *
 * Combines Walker, Iterator, and Scheduler patterns.
 * Demonstrates basic time-slicing and iterative DFS.
 */
export type FiberNode = {
    type: string;
    id: string;
    child?: FiberNode;
    sibling?: FiberNode;
    return?: FiberNode;
    processed?: boolean;
};
export declare function performUnitOfWork(unitOfWork: FiberNode): FiberNode | null;
export declare class Scheduler {
    private nextUnitOfWork;
    private deadline;
    private frameTime;
    constructor(root: FiberNode);
    start(): void;
    private scheduleWork;
    private workLoop;
}
