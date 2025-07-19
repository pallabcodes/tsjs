"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BinaryHeap_1 = require("../../nonLinear-unordered/binary-heap/heap-lab/core/BinaryHeap");
class TaskScheduler {
    constructor() {
        this.taskStack = []; // Stack to track task states
        // Min-heap of tasks: higher priority tasks will come out first
        this.retryHeap = new BinaryHeap_1.BinaryHeap((a, b) => a.priority - b.priority);
    }
    addTask(task) {
        this.retryHeap.insert(task); // Push task to heap based on priority
    }
    retryTask(task) {
        if (task.failedRetries > 3) {
            console.log(`Task ${task.id} reached max retries`);
            return;
        }
        task.failedRetries++;
        this.retryHeap.insert(task); // Re-insert with updated priority
    }
    processTask() {
        const task = this.retryHeap.extract();
        if (task) {
            // Process the task (simulate success/failure)
            console.log(`Processing task: ${task.id}`);
            this.taskStack.push(task); // Track it as processed
        }
    }
}
/**
 * Explanation:
 *
 * The taskStack keeps track of all processed tasks.
 * The retryHeap ensures that tasks with the highest priority are processed first, and if they fail, they are retried with a backoff mechanism.
 *
 *
*/
//# sourceMappingURL=task-scheduling.js.map