"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskComparator = void 0;
const taskComparator = (a, b) => {
    if (a.runAt !== b.runAt) {
        return a.runAt - b.runAt; // earlier first
    }
    return b.priority - a.priority; // higher priority first
};
exports.taskComparator = taskComparator;
//# sourceMappingURL=MinHeap.js.map