"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StarvationAwareScheduler = void 0;
const BinaryHeap_1 = require("../heap-lab/core/BinaryHeap");
const starvationComparator_1 = require("./starvationComparator");
class StarvationAwareScheduler {
    constructor() {
        this.heap = new BinaryHeap_1.BinaryHeap(starvationComparator_1.starvationAwareComparator);
    }
    schedule(task) {
        this.heap.insert(task);
    }
    pollDueTasks() {
        const now = Date.now();
        const ready = [];
        while (!this.heap.isEmpty()) {
            const top = this.heap.peek();
            if (!top || top.runAt > now)
                break;
            ready.push(this.heap.extract());
        }
        return ready;
    }
    size() {
        return this.heap.size();
    }
    allTasks() {
        return this.heap.toArray().sort(starvationComparator_1.starvationAwareComparator);
    }
}
exports.StarvationAwareScheduler = StarvationAwareScheduler;
//# sourceMappingURL=starvationScheduer.js.map