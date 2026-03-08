"use strict";
/**
 * 3. REACT SCHEDULER & LANES SYSTEM
 *
 * An advanced implementation that prioritizes updates using bitmask lanes.
 * Architecture: Fiber Reconciler + Lane-aware Scheduler + Two-Phase Commit.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FiberReconciler = exports.Scheduler = exports.IdleLane = exports.TransitionLane = exports.DefaultLane = exports.InputLane = exports.SyncLane = exports.NoLane = void 0;
exports.getHighestPriorityLane = getHighestPriorityLane;
exports.NoLane = 0b00000;
exports.SyncLane = 0b00001;
exports.InputLane = 0b00010;
exports.DefaultLane = 0b00100;
exports.TransitionLane = 0b01000;
exports.IdleLane = 0b10000;
function getHighestPriorityLane(lanes) {
    return lanes & -lanes;
}
// 3️⃣ Scheduler
class Scheduler {
    reconciler;
    pendingLanes = exports.NoLane;
    nextUnitOfWork = null;
    deadline = 0;
    frameTime = 5;
    constructor(reconciler) {
        this.reconciler = reconciler;
    }
    scheduleUpdate(root, lane) {
        this.pendingLanes |= lane;
        if (!this.nextUnitOfWork || lane < this.nextUnitOfWork.lane) {
            this.nextUnitOfWork = root;
            this.nextUnitOfWork.lane = lane;
        }
        this.workLoopConcurrent();
    }
    workLoopConcurrent() {
        this.deadline = performance.now() + this.frameTime;
        const currentLane = getHighestPriorityLane(this.pendingLanes);
        while (this.nextUnitOfWork && performance.now() < this.deadline) {
            this.nextUnitOfWork = this.reconciler.performUnitOfWork(this.nextUnitOfWork, currentLane);
        }
        if (this.nextUnitOfWork) {
            setTimeout(() => this.workLoopConcurrent(), 1);
        }
        else {
            this.pendingLanes &= ~currentLane;
            this.reconciler.commitRoot();
            if (this.pendingLanes !== exports.NoLane) {
                this.workLoopConcurrent();
            }
        }
    }
}
exports.Scheduler = Scheduler;
// 4️⃣ Reconciler
class FiberReconciler {
    currentRoot = null;
    wipRoot = null;
    performUnitOfWork(unitOfWork, lane) {
        console.log(`[Stage3 - LANE ${lane}] Processing: ${unitOfWork.id}`);
        this.reconcileChildren(unitOfWork, unitOfWork.alternate?.child || null);
        if (unitOfWork.child)
            return unitOfWork.child;
        let next = unitOfWork;
        while (next) {
            if (next.sibling)
                return next.sibling;
            next = next.return;
        }
        return null;
    }
    reconcileChildren(wip, oldChild) {
        const elements = wip.props.children || [];
        let prevSibling = null;
        let index = 0;
        while (index < elements.length) {
            const element = elements[index];
            const newFiber = {
                id: element.id, type: element.type, props: element.props,
                child: null, sibling: null, return: wip,
                alternate: oldChild, effectTag: oldChild ? "UPDATE" : "PLACEMENT",
                lane: wip.lane
            };
            if (index === 0)
                wip.child = newFiber;
            else if (prevSibling)
                prevSibling.sibling = newFiber;
            prevSibling = newFiber;
            index++;
        }
    }
    commitRoot() {
        console.log("\n--- STARTING COMMIT PHASE (STAGE 3) ---");
        this.commitWork(this.wipRoot);
        this.currentRoot = this.wipRoot;
        this.wipRoot = null;
        console.log("--- COMMIT COMPLETE ---\n");
    }
    commitWork(fiber) {
        if (!fiber)
            return;
        if (fiber.effectTag === "PLACEMENT") {
            console.log(`[COMMIT] Placement detected: ${fiber.id}`);
        }
        else if (fiber.effectTag === "UPDATE") {
            console.log(`[COMMIT] Update detected: ${fiber.id}`);
        }
        this.commitWork(fiber.child);
        this.commitWork(fiber.sibling);
    }
}
exports.FiberReconciler = FiberReconciler;
if (require.main === module) {
    const reconciler = new FiberReconciler();
    const scheduler = new Scheduler(reconciler);
    const root = {
        id: "root", type: "root", props: { children: [{ id: "c1", type: "div", props: {} }] },
        child: null, sibling: null, return: null, alternate: null, effectTag: "NONE", lane: exports.NoLane
    };
    scheduler.scheduleUpdate(root, exports.DefaultLane);
}
//# sourceMappingURL=3-scheduler-lanes.js.map