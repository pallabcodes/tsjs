"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.starvationAwareComparator = void 0;
const starvationAwareComparator = (a, b) => {
    const now = Date.now();
    const score = (t) => t.priority + ((now - t.createdAt) * (t.agingFactor ?? 0));
    if (a.runAt !== b.runAt)
        return a.runAt - b.runAt;
    const aScore = score(a);
    const bScore = score(b);
    return bScore - aScore; // higher effective priority wins
};
exports.starvationAwareComparator = starvationAwareComparator;
//# sourceMappingURL=starvationComparator.js.map