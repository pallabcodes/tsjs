"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackpressureManager = void 0;
const BinaryHeap_1 = require("../heap-lab/core/BinaryHeap");
class BackpressureManager {
    constructor() {
        this.clientMap = new Map();
        this.heap = new BinaryHeap_1.BinaryHeap((a, b) => b.latencyMs - a.latencyMs); // Max latency first
    }
    updateClient(stat) {
        this.clientMap.set(stat.id, stat);
        this.heap.insert(stat);
    }
    getWorstClients(topK) {
        const result = [];
        const snapshot = new BinaryHeap_1.BinaryHeap(this.heap['compare'], this.heap.toArray());
        while (!snapshot.isEmpty() && result.length < topK) {
            const top = snapshot.extract();
            if (top)
                result.push(top);
        }
        return result;
    }
    getBestClients(topK) {
        const snapshot = this.heap.toArray().sort((a, b) => a.latencyMs - b.latencyMs);
        return snapshot.slice(0, topK);
    }
}
exports.BackpressureManager = BackpressureManager;
//# sourceMappingURL=BackpressureManager.js.map