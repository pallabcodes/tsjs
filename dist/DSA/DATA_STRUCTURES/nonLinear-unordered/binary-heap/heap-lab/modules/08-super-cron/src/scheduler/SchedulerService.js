"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerService = void 0;
const BinaryHeap_1 = require("../core/BinaryHeap");
const PersistentStore_1 = require("./PersistentStore");
const compareTasks = (a, b) => {
    if (a.runAt !== b.runAt)
        return a.runAt - b.runAt;
    return b.priority - a.priority;
};
class SchedulerService {
    constructor() {
        this.heap = new BinaryHeap_1.BinaryHeap(compareTasks);
        const persisted = (0, PersistentStore_1.load)();
        for (const task of persisted) {
            this.heap.insert(task);
        }
    }
    schedule(task) {
        this.heap.insert(task);
        (0, PersistentStore_1.save)(this.heap.toArray());
    }
    extractNext() {
        const t = this.heap.extract();
        (0, PersistentStore_1.save)(this.heap.toArray());
        return t;
    }
    pollDue() {
        const now = Date.now();
        const due = [];
        while (this.heap.size() > 0 && this.heap.peek().runAt <= now) {
            due.push(this.extractNext()); // Using wrapper
        }
        return due;
    }
    all() {
        return this.heap.toArray();
    }
}
exports.SchedulerService = SchedulerService;
//# sourceMappingURL=SchedulerService.js.map