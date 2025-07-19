"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskScheduler = void 0;
const BinaryHeap_1 = require("../heap-lab/core/BinaryHeap");
const MinHeap_1 = require("./MinHeap");
class TaskScheduler {
    constructor() {
        this.taskHeap = new BinaryHeap_1.BinaryHeap(MinHeap_1.taskComparator);
    }
    schedule(task) {
        this.taskHeap.insert(task);
    }
    pollDueTasks() {
        const now = Date.now();
        const due = [];
        while (!this.taskHeap.isEmpty() && this.taskHeap.peek().runAt <= now) {
            due.push(this.taskHeap.extract());
        }
        return due;
    }
    size() {
        return this.taskHeap.size();
    }
    nextTaskEta() {
        return this.taskHeap.peek()?.runAt ?? null;
    }
    allTasks() {
        return this.taskHeap ? [...this.taskHeap] : [];
    }
}
exports.TaskScheduler = TaskScheduler;
//# sourceMappingURL=TaskScheduler.js.map