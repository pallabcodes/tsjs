"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareWithAging = void 0;
const compareTasks = (a, b) => {
    if (a.runAt !== b.runAt)
        return a.runAt - b.runAt;
    return b.priority - a.priority;
};
// Starvation-aware comparator
const compareWithAging = (a, b) => {
    const now = Date.now();
    const aScore = a.runAt - now - a.priority * 100;
    const bScore = b.runAt - now - b.priority * 100;
    return aScore - bScore;
};
exports.compareWithAging = compareWithAging;
//# sourceMappingURL=Comparator.js.map