"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeightedFairQueueManager = void 0;
const BinaryHeap_1 = require("../../core/BinaryHeap");
class WeightedFairQueueManager {
    constructor() {
        this.sources = new Map();
        this.rrIndex = [];
    }
    registerSource(sourceId, weight = 1) {
        const heap = new BinaryHeap_1.BinaryHeap((a, b) => a.runAt - b.runAt || b.priority - a.priority);
        this.sources.set(sourceId, { weight, heap });
        for (let i = 0; i < weight; i++) {
            this.rrIndex.push(sourceId); // multiple entries = weighted round robin
        }
    }
    enqueue(task) {
        const meta = this.sources.get(task.sourceId);
        if (!meta)
            throw new Error(`Source ${task.sourceId} not registered`);
        meta.heap.insert(task);
    }
    pollNextTask() {
        for (let i = 0; i < this.rrIndex.length; i++) {
            const sourceId = this.rrIndex.shift();
            this.rrIndex.push(sourceId); // rotate
            const meta = this.sources.get(sourceId);
            const task = meta.heap.peek();
            if (task && task.runAt <= Date.now()) {
                return meta.heap.extract();
            }
        }
        return null;
    }
    getAllTasks() {
        return [...this.sources.values()].flatMap(src => src.heap.toArray());
    }
}
exports.WeightedFairQueueManager = WeightedFairQueueManager;
//# sourceMappingURL=WeightedFairQueueManager.js.map