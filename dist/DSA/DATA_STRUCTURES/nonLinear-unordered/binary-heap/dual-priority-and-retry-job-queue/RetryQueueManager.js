"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetryQueueManager = void 0;
const BinaryHeap_1 = require("../heap-lab/core/BinaryHeap");
// Dual-priority: ready jobs first, then by priority (higher is better)
const retryComparator = (a, b) => {
    const now = Date.now();
    const aReady = now >= a.nextRetryTime;
    const bReady = now >= b.nextRetryTime;
    if (aReady && !bReady)
        return -1;
    if (!aReady && bReady)
        return 1;
    if (!aReady && !bReady)
        return a.nextRetryTime - b.nextRetryTime; // who becomes ready first
    // Both are ready → compare priority (higher is better)
    return b.priority - a.priority;
};
class RetryQueueManager {
    constructor() {
        this.retryHeap = new BinaryHeap_1.BinaryHeap(retryComparator);
    }
    scheduleRetry(job) {
        this.retryHeap.insert(job);
    }
    getDueJobs() {
        const now = Date.now();
        const due = [];
        while (!this.retryHeap.isEmpty()) {
            const top = this.retryHeap.peek();
            if (!top)
                break;
            if (now < top.nextRetryTime)
                break;
            due.push(this.retryHeap.extract());
        }
        return due;
    }
    size() {
        return this.retryHeap.size();
    }
}
exports.RetryQueueManager = RetryQueueManager;
//# sourceMappingURL=RetryQueueManager.js.map