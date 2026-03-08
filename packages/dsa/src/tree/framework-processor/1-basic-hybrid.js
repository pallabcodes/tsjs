"use strict";
/**
 * 1. BASIC HYBRID PROCESSOR
 *
 * Combines Walker, Iterator, and Scheduler patterns.
 * Demonstrates basic time-slicing and iterative DFS.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scheduler = void 0;
exports.performUnitOfWork = performUnitOfWork;
function performUnitOfWork(unitOfWork) {
    console.log(`[Basic] Working on node: ${unitOfWork.id}`);
    unitOfWork.processed = true;
    if (unitOfWork.child)
        return unitOfWork.child;
    let nextNode = unitOfWork;
    while (nextNode) {
        if (nextNode.sibling)
            return nextNode.sibling;
        nextNode = nextNode.return;
    }
    return null;
}
class Scheduler {
    nextUnitOfWork = null;
    deadline = 0;
    frameTime = 5;
    constructor(root) {
        this.nextUnitOfWork = root;
    }
    start() {
        this.scheduleWork();
    }
    scheduleWork() {
        setTimeout(() => {
            this.deadline = performance.now() + this.frameTime;
            this.workLoop();
        }, 0);
    }
    workLoop() {
        while (this.nextUnitOfWork && performance.now() < this.deadline) {
            this.nextUnitOfWork = performUnitOfWork(this.nextUnitOfWork);
        }
        if (this.nextUnitOfWork) {
            console.log("--- Yielding ---");
            this.scheduleWork();
        }
        else {
            console.log("--- Traversal Complete ---");
        }
    }
}
exports.Scheduler = Scheduler;
// Demo Helper
function createMassiveTree(depth, width) {
    const root = { type: "root", id: "root" };
    let currentParent = root;
    for (let d = 0; d < depth; d++) {
        let firstChild;
        let prevSibling;
        for (let w = 0; w < width; w++) {
            const node = { type: "item", id: `d${d}-w${w}`, return: currentParent };
            if (!firstChild) {
                firstChild = node;
                currentParent.child = node;
            }
            if (prevSibling)
                prevSibling.sibling = node;
            prevSibling = node;
        }
        currentParent = firstChild;
    }
    return root;
}
if (require.main === module) {
    const rootNode = createMassiveTree(5, 3);
    const scheduler = new Scheduler(rootNode);
    scheduler.start();
}
//# sourceMappingURL=1-basic-hybrid.js.map