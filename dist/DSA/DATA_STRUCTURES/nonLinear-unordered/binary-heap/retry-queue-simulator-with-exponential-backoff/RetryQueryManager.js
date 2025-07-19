"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetryQueueManager = void 0;
const BinaryHeap_1 = require("../heap-lab/core/BinaryHeap");
class RetryQueueManager {
    constructor() {
        this.retryHeap = new BinaryHeap_1.BinaryHeap((a, b) => a.nextRetryTime - b.nextRetryTime);
    }
    scheduleRetry(job) {
        this.retryHeap.insert(job);
    }
    getDueJobs() {
        const now = Date.now();
        const due = [];
        while (!this.retryHeap.isEmpty() && this.retryHeap.peek().nextRetryTime <= now) {
            due.push(this.retryHeap.extract());
        }
        return due;
    }
    size() {
        return this.retryHeap.size();
    }
}
exports.RetryQueueManager = RetryQueueManager;
//# sourceMappingURL=RetryQueryManager.js.map