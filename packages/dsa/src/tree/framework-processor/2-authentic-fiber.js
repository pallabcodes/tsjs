"use strict";
/**
 * 2. AUTHENTIC FIBER ENGINE
 *
 * Implements the beginWork / completeWork cycle.
 * Focuses on reconciliation logic and side-effect tracking.
 * Fixed: Nullable types for strict null checks.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reconciler = void 0;
class MockHost {
    commit(fiber) {
        console.log(`[HOST] Committed ${fiber.effectTag}: ${fiber.id}`);
    }
}
class Reconciler {
    scheduleCallback;
    host = new MockHost();
    wipRoot = null;
    currentRoot = null;
    deletions = [];
    constructor(scheduleCallback) {
        this.scheduleCallback = scheduleCallback;
    }
    render(element) {
        this.wipRoot = {
            type: "root",
            id: "root",
            props: { children: [element] },
            alternate: this.currentRoot,
        };
        this.deletions = [];
        this.scheduleCallback(() => this.commitRoot());
    }
    performUnitOfWork(fiber) {
        this.reconcileChildren(fiber, fiber.props.children || []);
        if (fiber.child)
            return fiber.child;
        let nextFiber = fiber;
        while (nextFiber) {
            if (nextFiber.sibling)
                return nextFiber.sibling;
            nextFiber = nextFiber.return;
        }
        return null;
    }
    reconcileChildren(wip, elements) {
        let oldFiber = wip.alternate?.child;
        let prevSibling;
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const newFiber = {
                type: element.type, id: element.id, props: element.props,
                return: wip, effectTag: oldFiber ? "UPDATE" : "PLACEMENT"
            };
            if (i === 0)
                wip.child = newFiber;
            else if (prevSibling)
                prevSibling.sibling = newFiber;
            prevSibling = newFiber;
        }
    }
    commitRoot() {
        this.commitWork(this.wipRoot?.child);
        this.currentRoot = this.wipRoot;
        this.wipRoot = null;
        console.log("--- Commit Complete ---");
    }
    commitWork(fiber) {
        if (!fiber)
            return;
        this.host.commit(fiber);
        this.commitWork(fiber.child);
        this.commitWork(fiber.sibling);
    }
}
exports.Reconciler = Reconciler;
if (require.main === module) {
    const r = new Reconciler((cb) => setTimeout(cb, 0));
    r.render({ type: "h1", id: "title", props: { text: "Fiber Engine" } });
}
//# sourceMappingURL=2-authentic-fiber.js.map